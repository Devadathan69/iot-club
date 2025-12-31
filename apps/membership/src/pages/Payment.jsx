import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QrCode, CreditCard, Loader2, AlertCircle, ArrowRight, Upload } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Cloudinary Config
// Cloudinary Config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Payment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fee = 100;

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [screenshotUrl, setScreenshotUrl] = useState(null);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('temp_member_data');
        if (!data) {
            navigate('/');
            return;
        }
        setUserData(JSON.parse(data));
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", UPLOAD_PRESET);

        setUploadingImage(true);
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            setUploadingImage(false);
            if (data.secure_url) {
                setScreenshotUrl(data.secure_url);
                return data.secure_url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (err) {
            console.error("Cloudinary Error:", err);
            setUploadingImage(false);
            throw err;
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedImage) {
            setError("Please upload a screenshot of your payment.");
            setLoading(false);
            return;
        }

        try {
            // 1. Upload Image First
            let uploadedUrl = screenshotUrl;
            if (!uploadedUrl) {
                uploadedUrl = await uploadToCloudinary();
            }

            // 2. Save member request to Firestore
            const memberData = {
                ...userData,
                transactionId: 'SCREENSHOT_VERIFICATION', // Placeholder
                screenshotUrl: uploadedUrl,
                status: 'pending_approval',
                membershipId: null,
                paymentAmount: fee,
                paymentMethod: 'upl_screenshot',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'members'), memberData);

            // Clear temp data
            sessionStorage.removeItem('temp_member_data');

            navigate('/success', {
                state: {
                    memberData: { ...memberData, id: 'PENDING' }
                }
            });

        } catch (err) {
            console.error(err);
            setError("Failed to submit request. Please check your connection and try again.");
            setLoading(false);
        }
    };

    if (!userData) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Left Side: QR Code & Instructions */}
                <div className="md:w-1/2 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                        {/* Placeholder QR Code - In production replace with real QR */}
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400">
                            <QrCode className="w-16 h-16 text-gray-500" />
                            <span className="sr-only">Access via UPI App</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">Scan & Pay ₹{fee}</h2>
                    <p className="text-gray-400 text-center text-sm max-w-xs mb-6">
                        Use any UPI App to scan the QR code.
                    </p>
                </div>

                {/* Right Side: Verification Form */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mb-6">
                        <p className="text-neon-cyan font-mono text-xs mb-2">STEP 2 OF 2</p>
                        <h1 className="text-2xl font-bold text-white mb-1">Upload Proof</h1>
                        <p className="text-gray-400 text-sm">Upload the payment screenshot.</p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        {/* Screenshot Upload */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5 ml-1">Payment Screenshot</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${imagePreview ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'border-gray-700 hover:border-gray-500 bg-dark-bg'
                                        }`}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                                            <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500 gap-2">
                                            <Upload className="w-8 h-8 text-neon-cyan" />
                                            <span className="text-sm font-medium text-white">Click to upload screenshot</span>
                                            <span className="text-xs">Supports JPG, PNG</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm animate-pulse">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading || uploadingImage ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploadingImage ? 'Uploading...' : 'Verifying...'}
                                </>
                            ) : (
                                <>
                                    Submit Request
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
