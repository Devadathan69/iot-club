import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { useCart } from '../contexts/CartContext';

export default function DeviceModal({ device, isOpen, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    if (!isOpen || !device) return null;

    const handleAddToCart = () => {
        addToCart(device, quantity);
        onClose();
        setQuantity(1);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        layoutId={`card-${device.id}`}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-navy-800 w-full max-w-lg rounded-xl border border-navy-600 shadow-2xl overflow-hidden pointer-events-auto relative">
                            {/* Circuit Border Animation */}
                            <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-xl pointer-events-none" />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-100">{device.name}</h2>
                                        <p className="font-mono text-cyan-400 text-sm mt-1">{device.model}</p>
                                    </div>
                                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-slate-300 leading-relaxed">
                                        {device.description}
                                    </p>

                                    <div className="bg-navy-900/50 p-4 rounded-lg border border-navy-700">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Availability</span>
                                            <span className={device.available_stock > 0 ? "text-green-400" : "text-red-400"}>
                                                {device.available_stock > 0 ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-navy-700 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-cyan-400 h-full transition-all duration-500"
                                                style={{ width: `${(device.available_stock / device.total_stock) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-xs text-slate-500 mt-1">
                                            {device.available_stock} / {device.total_stock} units
                                        </div>
                                    </div>

                                    {device.available_stock > 0 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 bg-navy-900 rounded-lg p-1 border border-navy-700">
                                                    <button
                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                        className="p-2 hover:text-cyan-400 disabled:opacity-50"
                                                        disabled={quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-mono w-8 text-center">{quantity}</span>
                                                    <button
                                                        onClick={() => setQuantity(Math.min(device.available_stock, quantity + 1))}
                                                        className="p-2 hover:text-cyan-400 disabled:opacity-50"
                                                        disabled={quantity >= device.available_stock}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <Button onClick={handleAddToCart} className="flex-1">
                                                    Add to Cart
                                                </Button>
                                            </div>
                                            <p className="text-xs text-amber-500/80 flex items-center gap-1.5 justify-end">
                                                <AlertTriangle className="w-3 h-3" />
                                                Late returns ({'>'}14 days) will incur a fine of ₹2.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="text-sm">Currently unavailable. Check back later.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
