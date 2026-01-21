import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { manualLend } from '../../lib/requests';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Plus, Minus, Search, AlertTriangle } from 'lucide-react';

export default function ManualLendModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const [devices, setDevices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [userInfo, setUserInfo] = useState({
        name: '',
        roll_no: '', // admission_no
        student_class: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (!isOpen) return;
        const q = query(collection(db, 'devices'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [isOpen]);

    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddItem = (device) => {
        if (device.available_stock <= 0) return;

        setSelectedItems(prev => {
            const existing = prev.find(i => i.id === device.id);
            if (existing) {
                if (existing.quantity >= device.available_stock) return prev;
                return prev.map(i => i.id === device.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...device, quantity: 1 }];
        });
    };

    const handleRemoveItem = (deviceId) => {
        setSelectedItems(prev => prev.filter(i => i.id !== deviceId));
    };

    const updateQuantity = (deviceId, newQty) => {
        if (newQty < 1) return;
        const device = devices.find(d => d.id === deviceId);
        if (newQty > device.available_stock) return;

        setSelectedItems(prev => prev.map(i =>
            i.id === deviceId ? { ...i, quantity: newQty } : i
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) return alert('Please select at least one item');
        if (!userInfo.name || !userInfo.email) return alert('Name and Email are required');

        if (!confirm('Confirm manual lend?')) return;

        setLoading(true);
        try {
            // Default 14 days return
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 14);

            await manualLend(currentUser.uid, {
                ...userInfo,
                admission_no: userInfo.roll_no, // mapping for consistency
                displayName: userInfo.name // mapping for consistency
            }, selectedItems, returnDate);

            alert('Lend recorded successfully!');
            onClose();
            // Reset form
            setUserInfo({ name: '', roll_no: '', student_class: '', email: '', phone: '' });
            setSelectedItems([]);
        } catch (error) {
            console.error(error);
            alert('Failed to record lend: ' + error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-navy-800 w-full max-w-4xl max-h-[90vh] rounded-xl border border-navy-600 shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-navy-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-100">Manual Lend (Offline Register)</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Item Selection */}
                    <div className="w-full md:w-1/2 p-4 border-r border-navy-700 flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-navy-900 border border-navy-600 rounded-lg pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {filteredDevices.map(device => (
                                <div key={device.id} className="bg-navy-900/50 p-3 rounded-lg border border-navy-800 flex justify-between items-center group hover:border-cyan-500/30 transition-colors">
                                    <div>
                                        <div className="font-medium text-slate-200">{device.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{device.model}</div>
                                        <div className={`text-xs ${device.available_stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            Stock: {device.available_stock}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleAddItem(device)}
                                        disabled={device.available_stock === 0}
                                        variant="ghost"
                                        className="hover:bg-cyan-500/10 hover:text-cyan-400"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: User Details & Cart */}
                    <div className="w-full md:w-1/2 p-4 flex flex-col overflow-y-auto">
                        <form id="manual-lend-form" onSubmit={handleSubmit} className="space-y-4 mb-6">
                            <h3 className="font-bold text-slate-300 border-b border-navy-700 pb-2">User Details</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Name" required
                                    value={userInfo.name}
                                    onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                                />
                                <Input
                                    label="Roll No / ID"
                                    value={userInfo.roll_no}
                                    onChange={e => setUserInfo({ ...userInfo, roll_no: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Class/Batch"
                                    value={userInfo.student_class}
                                    onChange={e => setUserInfo({ ...userInfo, student_class: e.target.value })}
                                />
                                <Input
                                    label="Phone"
                                    value={userInfo.phone}
                                    onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Email" type="email" required
                                value={userInfo.email}
                                onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                            />
                        </form>

                        <h3 className="font-bold text-slate-300 border-b border-navy-700 pb-2 mb-3">Selected Items</h3>
                        <div className="flex-1 space-y-2 mb-4">
                            {selectedItems.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No items selected</p>}
                            {selectedItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-navy-900/30 p-2 rounded border border-navy-700">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-300">{item.name}</div>
                                        <div className="text-xs text-slate-500">Max: {item.available_stock}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-cyan-400"><Minus className="w-3 h-3" /></button>
                                        <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-cyan-400"><Plus className="w-3 h-3" /></button>
                                        <button onClick={() => handleRemoveItem(item.id)} className="p-1 text-slate-500 hover:text-red-400 ml-1"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg mb-4 flex gap-2 items-start">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200/80">
                                Returns exceeding 14 days will automatically incur a fine of ₹2. Please inform the borrower.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            form="manual-lend-form"
                            className="w-full"
                            disabled={loading || selectedItems.length === 0}
                        >
                            {loading ? 'Processing...' : 'Complete Lend'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
