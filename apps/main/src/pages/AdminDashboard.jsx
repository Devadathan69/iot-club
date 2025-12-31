import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, X, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let q;
            if (activeTab === 'pending') {
                q = query(
                    collection(db, 'members'),
                    where('status', '==', 'pending_approval')
                );
            } else {
                q = query(
                    collection(db, 'members'),
                    orderBy('createdAt', 'desc') // Ensure Firestore index exists or remove this
                );
            }

            // Try fetching with order, if fails (no index), fetch without order
            try {
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRequests(data);
            } catch (indexError) {
                console.warn("Indexing error, falling back to unordered fetch", indexError);
                // Fallback for 'all' without index
                const fallbackQ = activeTab === 'pending'
                    ? query(collection(db, 'members'), where('status', '==', 'pending_approval'))
                    : collection(db, 'members');

                const querySnapshot = await getDocs(fallbackQ);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Client-side sort if needed
                if (activeTab === 'all') {
                    data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                }
                setRequests(data);
            }

        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateNextId = async () => {
        // Simple client-side ID generation
        try {
            // Simplified logic: fetching all members to find max ID is inefficient but works for small scale v1
            const snapshot = await getDocs(collection(db, 'members'));
            let maxId = 25000;
            snapshot.forEach(doc => {
                const mid = doc.data().membershipId;
                if (mid && mid.startsWith('IOT')) {
                    const num = parseInt(mid.replace('IOT', ''));
                    if (!isNaN(num) && num > maxId) maxId = num;
                }
            });
            return `IOT${maxId + 1}`;
        } catch (e) {
            console.error(e);
            return `IOT${Math.floor(25001 + Math.random() * 9000)}`;
        }
    };

    const handleApprove = async (member) => {
        setActionLoading(member.id);
        try {
            const newId = await generateNextId();

            await updateDoc(doc(db, 'members', member.id), {
                status: 'approved',
                membershipId: newId,
                approvedAt: new Date()
            });

            // Simulate Email Sending
            console.log(`[EMAIL SIMULATION] Sending membership confirmed email to ${member.email}`);
            console.log(`[EMAIL CONTENT] Subject: Welcome to IoT Club! Name: ${member.fullName}, ID: ${newId}.`);

            alert(`Approved ${member.fullName}! Assigned ID: ${newId}.\n\n(Simulated) Email sent to ${member.email}`);

            // Remove from local list if in pending view
            if (activeTab === 'pending') {
                setRequests(prev => prev.filter(r => r.id !== member.id));
            } else {
                fetchRequests(); // Refresh for 'all' view
            }

        } catch (error) {
            console.error("Error approving:", error);
            alert("Failed to approve. Check console.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (memberId) => {
        if (!confirm("Are you sure you want to reject this request?")) return;

        setActionLoading(memberId);
        try {
            await updateDoc(doc(db, 'members', memberId), {
                status: 'rejected'
            });
            if (activeTab === 'pending') {
                setRequests(prev => prev.filter(r => r.id !== memberId));
            } else {
                fetchRequests();
            }
        } catch (error) {
            console.error("Error rejecting:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && requests.length === 0) return (
        <div className="min-h-screen pt-24 flex justify-center bg-white dark:bg-dark-bg text-black dark:text-white">
            <Loader2 className="animate-spin w-8 h-8 text-neon-cyan" />
        </div>
    );

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto bg-white dark:bg-dark-bg text-gray-800 dark:text-white pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold font-display">Membership Verification</h1>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-dark-card p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-white dark:bg-neon-cyan/20 text-neon-cyan shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Pending Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-neon-cyan/20 text-neon-cyan shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        All Members
                    </button>
                </div>
            </div>

            {/* Content Switch */}
            {activeTab === 'pending' ? (
                requests.length === 0 ? (
                    <div className="text-center py-20 bg-gray-100 dark:bg-dark-card rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500">No pending verification requests.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((request) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center"
                            >
                                {/* Screenshot Preview */}
                                <div className="w-full md:w-48 shrink-0">
                                    {request.screenshotUrl ? (
                                        <a href={request.screenshotUrl} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-lg border border-gray-700">
                                            <img src={request.screenshotUrl} alt="Proof" className="w-full h-32 object-cover object-top group-hover:scale-110 transition-transform" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <ExternalLink className="text-white w-6 h-6" />
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-xs ml-2">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                        <h3 className="text-xl font-bold">{request.fullName}</h3>
                                        {/* Admission Number used to be Roll No, checking if rollout matches */}
                                        <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20 rounded-full font-mono uppercase">
                                            {request.admissionNo || request.rollNo}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <p>Email: <span className="text-gray-900 dark:text-gray-200 select-all">{request.email}</span></p>
                                        <p>Phone: <span className="text-gray-900 dark:text-gray-200">{request.phone}</span></p>
                                        <p>Batch: <span className="text-gray-900 dark:text-gray-200">{request.batch || request.department}</span></p>
                                        <p>Joined: <span className="text-gray-900 dark:text-gray-200">{request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span></p>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-black/30 px-3 py-2 rounded-lg inline-block">
                                        <span className="text-xs text-gray-500 mr-2">Transaction ID:</span>
                                        <span className="font-mono text-neon-cyan select-all">{request.transactionId}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        disabled={actionLoading === request.id}
                                        className="flex-1 md:flex-none px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(request)}
                                        disabled={actionLoading === request.id}
                                        className="flex-1 md:flex-none px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-neon-cyan/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {actionLoading === request.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />}
                                        Approve
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            ) : (
                /* ALL MEMBERS TABLE */
                <div className="overflow-x-auto bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Batch</th>
                                <th className="px-6 py-4">Admission No</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Mid</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {requests.map(member => (
                                <tr key={member.id} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{member.fullName}</td>
                                    <td className="px-6 py-4">{member.batch || member.department}</td>
                                    <td className="px-6 py-4">{member.admissionNo || member.rollNo}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">{member.email}</span>
                                            <span className="text-xs text-gray-400">{member.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-neon-cyan">
                                        {member.membershipId || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${member.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                member.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {member.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && <div className="p-8 text-center text-gray-500">No members found.</div>}
                </div>
            )}
        </div>
    );
}
