import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../lib/firebase';
import { acceptRequest, markReturned } from '../../lib/requests';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader2, Check, X, Plus, Trash2, Edit2 } from 'lucide-react';
import InventoryForm from './InventoryForm';
import ManualLendModal from './ManualLendModal';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [borrowLogs, setBorrowLogs] = useState([]);
    const [devices, setDevices] = useState([]);
    const [activeTab, setActiveTab] = useState('requests');
    const [showInventoryForm, setShowInventoryForm] = useState(false);
    const [showManualLend, setShowManualLend] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);

    const sendReturnNotification = httpsCallable(functions, 'sendReturnNotification');

    const handleNotify = async (log) => {
        if (!confirm(`Send return reminder to ${log.user_email}?`)) return;
        try {
            const result = await sendReturnNotification({
                email: log.user_email,
                userName: log.user_name,
                items: log.items
            });
            alert(`Notification sent: ${result.data.message}`);
        } catch (error) {
            console.error(error);
            alert('Failed to send notification. Check console for details.');
        }
    };

    useEffect(() => {
        const unsubRequests = onSnapshot(
            query(collection(db, 'lendRequests'), orderBy('created_at', 'desc')),
            (snapshot) => {
                setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        const unsubLogs = onSnapshot(
            query(collection(db, 'borrowLogs'), orderBy('date_borrowed', 'desc')),
            (snapshot) => {
                setBorrowLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        const unsubDevices = onSnapshot(
            query(collection(db, 'devices'), orderBy('name')),
            (snapshot) => {
                setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        return () => {
            unsubRequests();
            unsubLogs();
            unsubDevices();
        };
    }, []);

    const handleAccept = async (request) => {
        if (!confirm('Accept this request?')) return;
        try {
            // Default return date: 14 days from now (per fine policy)
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 14);

            await acceptRequest(request.id, currentUser.uid, new Date(), returnDate);
        } catch (error) {
            alert(error);
        }
    };

    const handleReject = async (requestId) => {
        if (!confirm('Reject this request?')) return;
        try {
            await updateDoc(doc(db, 'lendRequests', requestId), {
                status: 'Rejected',
                admin_id: currentUser.uid
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReturn = async (log) => {
        const now = new Date();
        const dueDate = log.expected_return_date?.toDate();
        let fine = 0;
        let daysOverdue = 0;

        if (dueDate && now > dueDate) {
            const diffTime = Math.abs(now - dueDate);
            daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysOverdue > 10) { // Should this be > 0 (strictly after due date which IS 10 days)? 
                // User said "if the due date of 10 days is exceeded". That implies due date IS the limit.
                // So if return is *after* due date, fine applies?
                // Wait, "if the due date of 10 days is exceeded". 
                // Usually means: You have 10 days. If you take 11, fine.
                // So if now > dueDate.
                // But wait, "late returns > 10 days".
                // If I set due date to +10 days, then any time after due date is > 10 days from borrow.
                fine = 50;
            }
        }

        // Simplification: logic is "if overdue, fine is 50".
        // If dueDate is passed, it is overdue.
        if (dueDate && now > dueDate) {
            fine = 50;
        }


        const message = fine > 0
            ? `⚠️ OVERDUE! Fine of ₹${fine} applies.\n\nMark items as returned after collecting fine?`
            : 'Mark items as returned?';

        if (!confirm(message)) return;

        try {
            await markReturned(log.id, log.items, currentUser.uid, fine);
        } catch (error) {
            alert(error);
        }
    };

    const handleDeleteDevice = async (deviceId) => {
        if (!confirm('Are you sure you want to delete this device?')) return;
        try {
            await deleteDoc(doc(db, 'devices', deviceId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <ManualLendModal isOpen={showManualLend} onClose={() => setShowManualLend(false)} />

            <div className="flex gap-4 border-b border-navy-700 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Pending Requests
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'active' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Active Borrows
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'history' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'inventory' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Inventory
                </button>
            </div>

            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {requests.filter(r => r.status === 'Pending').length === 0 && (
                        <p className="text-slate-500">No pending requests.</p>
                    )}
                    {requests.filter(r => r.status === 'Pending').map(request => (
                        <div key={request.id} className="bg-navy-800 p-4 rounded-lg border border-navy-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-200">{request.user_name}</h3>
                                    <p className="text-sm text-slate-400">{request.student_class} • {request.admission_no}</p>
                                    <p className="text-sm text-slate-500 mt-1">ID: {request.id}</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button size="sm" variant="danger" className="flex-1 sm:flex-none" onClick={() => handleReject(request.id)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" className="flex-1 sm:flex-none" onClick={() => handleAccept(request)}>
                                        <Check className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-navy-900/50 p-3 rounded border border-navy-800">
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Requested Items</p>
                                <ul className="space-y-1">
                                    {request.items.map((item, idx) => (
                                        <li key={idx} className="text-sm text-slate-300 flex justify-between">
                                            <span>{item.device_name}</span>
                                            <span className="font-mono text-cyan-400">x{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                {request.message && (
                                    <p className="mt-3 text-sm text-slate-400 italic">"{request.message}"</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'active' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setShowManualLend(true)} variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                            <Plus className="w-4 h-4 mr-2" />
                            Manual Lend / Offline Register
                        </Button>
                    </div>

                    {borrowLogs.filter(l => l.status === 'Borrowed').length === 0 && (
                        <p className="text-slate-500">No active borrows.</p>
                    )}
                    {borrowLogs.filter(l => l.status === 'Borrowed').map(log => (
                        <div key={log.id} className="bg-navy-800 p-4 rounded-lg border border-navy-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-200">{log.user_name || log.user_email}</h3>
                                    <p className="text-sm text-slate-400">Due: {log.expected_return_date?.toDate().toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-500">{log.user_email}</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" onClick={() => handleNotify(log)}>
                                        Notify Return
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleReturn(log)}>
                                        Mark Returned
                                    </Button>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                {log.items.map((item, idx) => (
                                    <li key={idx} className="text-sm text-slate-300 flex justify-between">
                                        <span>{item.device_name}</span>
                                        <span className="font-mono text-cyan-400">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    {borrowLogs.filter(l => l.status === 'Returned').length === 0 && (
                        <p className="text-slate-500">No history available.</p>
                    )}
                    {borrowLogs.filter(l => l.status === 'Returned').map(log => (
                        <div key={log.id} className="bg-navy-800 p-4 rounded-lg border border-navy-700 opacity-75">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-300">{log.user_name || log.user_email}</h3>
                                    <p className="text-sm text-slate-400">Returned: {log.date_returned?.toDate().toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-500">{log.user_email}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                                        Returned
                                    </span>
                                    {log.fine_amount > 0 && (
                                        <div className="mt-2 text-xs text-red-400 font-mono">
                                            Fine Paid: ₹{log.fine_amount}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ul className="space-y-1">
                                {log.items.map((item, idx) => (
                                    <li key={idx} className="text-sm text-slate-400 flex justify-between">
                                        <span>{item.device_name}</span>
                                        <span className="font-mono text-slate-500">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingDevice(null); setShowInventoryForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Component
                        </Button>
                    </div>

                    {showInventoryForm && (
                        <div className="bg-navy-800 p-6 rounded-lg border border-navy-700 mb-6">
                            <h3 className="text-lg font-bold text-slate-100 mb-4">
                                {editingDevice ? 'Edit Component' : 'Add New Component'}
                            </h3>
                            <InventoryForm
                                initialData={editingDevice}
                                onSuccess={() => {
                                    setShowInventoryForm(false);
                                    setEditingDevice(null);
                                }}
                                onCancel={() => {
                                    setShowInventoryForm(false);
                                    setEditingDevice(null);
                                }}
                            />
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-navy-700">
                        <table className="w-full text-left text-sm text-slate-400 min-w-[600px]">
                            <thead className="bg-navy-800 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Model</th>
                                    <th className="p-3 text-center">Stock</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-700">
                                {devices.map(device => (
                                    <tr key={device.id} className="hover:bg-navy-800/50">
                                        <td className="p-3 font-medium text-slate-300">{device.name}</td>
                                        <td className="p-3 font-mono text-xs">{device.model}</td>
                                        <td className="p-3 text-center">
                                            <span className={device.available_stock === 0 ? 'text-red-400' : 'text-green-400'}>
                                                {device.available_stock}
                                            </span>
                                            <span className="text-slate-600"> / {device.total_stock}</span>
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button
                                                onClick={() => { setEditingDevice(device); setShowInventoryForm(true); }}
                                                className="text-cyan-400 hover:text-cyan-300"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDevice(device.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
