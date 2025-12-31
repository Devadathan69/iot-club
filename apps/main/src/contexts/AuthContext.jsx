import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [membershipData, setMembershipData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Check Admin Claim (or loose check for demo)
                try {
                    const token = await user.getIdTokenResult();
                    // Fallback loose check if claim not set yet for demo convenience
                    if (token.claims.admin || user.email === 'admin@iotclub.com' || user.email?.includes('admin')) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (e) {
                    console.error("Error checking claims", e);
                }

                // Check Membership Status
                try {
                    const q = query(collection(db, 'members'), where('email', '==', user.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const data = querySnapshot.docs[0].data();
                        setMembershipData(data);

                        // Check if approved and has membership ID
                        if (data.status === 'approved' && data.membershipId) {
                            setIsMember(true);
                        } else {
                            setIsMember(false);
                        }
                    } else {
                        setMembershipData(null);
                        setIsMember(false);
                    }
                } catch (error) {
                    console.error("Error checking membership:", error);
                    setIsMember(false);
                }

            } else {
                setIsAdmin(false);
                setIsMember(false);
                setMembershipData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function signup(email, password, name) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
            await updateProfile(result.user, {
                displayName: name
            });
        }
        return result;
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function logout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        isAdmin,
        isMember,
        membershipData,
        login,
        signup,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
