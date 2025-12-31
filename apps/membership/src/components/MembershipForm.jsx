import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, BookOpen, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
            <input
                {...props}
                className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-gray-600"
            />
        </div>
    </div>
);

export default function MembershipForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        admissionNo: '',
        batch: '',
        phone: '',
        email: ''
    });
    const [rulesAccepted, setRulesAccepted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save to sessionStorage/Context (Mock persistence)
        sessionStorage.setItem('temp_member_data', JSON.stringify(formData));
        navigate('/payment');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                label="Full Name"
                icon={User}
                name="fullName"
                placeholder="Enter your name"
                required
                value={formData.fullName}
                onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Admission No"
                    icon={Hash}
                    name="admissionNo"
                    placeholder="Enter your admission number"
                    required
                    value={formData.admissionNo}
                    onChange={handleChange}
                />
                <InputField
                    label="Batch"
                    icon={BookOpen}
                    name="batch"
                    placeholder="Eg. S4DS"
                    required
                    value={formData.batch}
                    onChange={handleChange}
                />
            </div>

            <InputField
                label="Phone Number"
                icon={Phone}
                name="phone"
                type="tel"
                placeholder="+91 99999..."
                required
                value={formData.phone}
                onChange={handleChange}
            />

            <InputField
                label="Email Address"
                icon={Mail}
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
            />

            {/* Rules Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <input
                    type="checkbox"
                    id="rules"
                    checked={rulesAccepted}
                    onChange={(e) => setRulesAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 text-neon-cyan focus:ring-neon-cyan/50 bg-gray-800"
                />
                <label htmlFor="rules" className="text-sm text-gray-400">
                    I have read and agree to the <a href="https://drive.google.com/file/d/1ja5iRdEOfi0FrAYKFarZM5EwmffNQ-6T/view" target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline hover:text-neon-cyan/80">Rules and Regulations</a> of the IoT Club.
                </label>
            </div>

            <motion.button
                whileHover={{ scale: rulesAccepted ? 1.02 : 1 }}
                whileTap={{ scale: rulesAccepted ? 0.98 : 1 }}
                type="submit"
                disabled={!rulesAccepted}
                className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-8 ${rulesAccepted
                    ? "bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
            >
                Proceed to Payment <ArrowRight className="w-5 h-5" />
            </motion.button>
        </form>
    );
}
