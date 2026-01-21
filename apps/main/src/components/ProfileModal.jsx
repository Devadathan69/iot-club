import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, BookOpen, Hash, Calendar, ShieldCheck, ShieldAlert, Award, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const [membership, setMembership] = useState(null);
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !currentUser?.email) return;

        setLoading(true);

        // Fetch Membership Details
        // Note: Using 'members' collection which is shared (same project)
        const memberQuery = query(collection(db, 'members'), where('email', '==', currentUser.email));
        const unsubMember = onSnapshot(memberQuery, (snapshot) => {
            if (!snapshot.empty) {
                setMembership({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            } else {
                setMembership(null);
            }
        });

        // Fetch Active Borrows
        // Note: Using 'borrowLogs' collection which is shared
        const borrowQuery = query(collection(db, 'borrowLogs'),
            where('user_email', '==', currentUser.email),
            where('status', '==', 'Borrowed')
        );
        const unsubBorrows = onSnapshot(borrowQuery, (snapshot) => {
            setBorrows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => {
            unsubMember();
            unsubBorrows();
        };
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    // ... Using identical JSX structure for consistency ...
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 p-6 flex items-end">
                        <div className="absolute top-4 right-4">
                            <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-black border-4 border-dark-card flex items-center justify-center shadow-xl">
                                {currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-neon-cyan">
                                        {currentUser?.displayName?.[0] || <User className="w-10 h-10" />}
                                    </span>
                                )}
                            </div>
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-white">{currentUser?.displayName || 'User'}</h2>
                                <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

                        {/* Membership Card */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Membership Status</h3>
                            {membership ? (
                                <div className="bg-gradient-to-br from-black to-gray-900 p-5 rounded-xl border border-dark-border relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="font-semibold text-white">{membership.fullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Membership ID</p>
                                            <p className="font-mono font-bold text-neon-cyan">{membership.membershipId || 'PENDING'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Batch</p>
                                            <p className="text-gray-300">
                                                <BookOpen className="w-3 h-3 inline mr-1 text-gray-500" />
                                                {membership.batch}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Admission No</p>
                                            <p className="text-gray-300">
                                                <Hash className="w-3 h-3 inline mr-1 text-gray-500" />
                                                {membership.admissionNo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {membership.status === 'active' ? (
                                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <ShieldAlert className="w-4 h-4 text-amber-400" />
                                            )}
                                            <span className={`text-sm font-medium ${membership.status === 'active' ? 'text-green-400' : 'text-amber-400'} uppercase`}>
                                                {membership.status || 'Pending Approval'}
                                            </span>
                                        </div>
                                        <Award className="w-12 h-12 text-white/5 absolute bottom-2 right-2" />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-black/20 border border-dashed border-gray-700 rounded-xl p-6 text-center">
                                    <ShieldAlert className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-500 mb-2">No active membership found.</p>
                                    <a href="/membership" className="text-neon-cyan hover:underline text-sm">Register for Membership &rarr;</a>
                                </div>
                            )}
                        </div>

                        {/* Active Borrows */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                                Active Borrows
                                <span className="text-xs font-normal normal-case bg-black/40 px-2 py-0.5 rounded text-gray-400">
                                    {borrows.length} Items
                                </span>
                            </h3>

                            {borrows.length > 0 ? (
                                <div className="space-y-3">
                                    {borrows.map(log => (
                                        <div key={log.id} className="bg-black/40 p-4 rounded-lg border border-dark-border flex justify-between items-center group hover:border-gray-600 transition-colors">
                                            <div>
                                                <ul className="space-y-1 mb-2">
                                                    {log.items.map((item, idx) => (
                                                        <li key={idx} className="text-sm font-medium text-white">
                                                            {item.device_name} <span className="text-neon-cyan text-xs">x{item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Due: {log.expected_return_date?.toDate().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                                                    Borrowed
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No items currently borrowed.</p>
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
