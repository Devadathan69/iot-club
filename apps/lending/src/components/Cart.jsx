import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import RequestForm from './RequestForm';

export default function Cart() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [showRequestForm, setShowRequestForm] = React.useState(false);
    const navigate = useNavigate();

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        if (!currentUser) {
            setIsCartOpen(false);
            navigate('/login');
            return;
        }
        setShowRequestForm(true);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-900 border-l border-navy-700 shadow-2xl flex flex-col"
                    >
                        <div className="p-4 border-b border-navy-700 flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="text-cyan-400">Cart</span>
                                <span className="text-slate-500 text-sm font-normal">({totalItems} items)</span>
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                    <p>Your cart is empty</p>
                                    <Button variant="outline" size="sm" onClick={() => setIsCartOpen(false)}>
                                        Browse Components
                                    </Button>
                                </div>
                            ) : showRequestForm ? (
                                <RequestForm
                                    onCancel={() => setShowRequestForm(false)}
                                    onSuccess={() => {
                                        clearCart();
                                        setShowRequestForm(false);
                                        setIsCartOpen(false);
                                    }}
                                />
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="bg-navy-800 p-4 rounded-lg border border-navy-700 flex gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-200">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-mono mb-2">{item.model}</p>
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    className="bg-navy-900 border border-navy-600 rounded text-sm px-2 py-1 focus:ring-cyan-400 focus:border-cyan-400"
                                                >
                                                    {[...Array(Math.min(item.available_stock, 5)).keys()].map(i => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <span className="text-xs text-slate-500">
                                                    Max: {item.available_stock}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-500 hover:text-red-400 self-start"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {!showRequestForm && cartItems.length > 0 && (
                            <div className="p-4 border-t border-navy-700 bg-navy-800/50">
                                <div className="mb-3 px-1">
                                    <p className="text-xs text-amber-500/80 flex items-center gap-1.5 justify-center text-center">
                                        <span className="shrink-0">⚠️</span>
                                        Late returns ({'>'}14 days) will incur a fine of ₹2.
                                    </p>
                                </div>
                                <Button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2">
                                    {currentUser ? 'Proceed to Request' : 'Login to Request'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
