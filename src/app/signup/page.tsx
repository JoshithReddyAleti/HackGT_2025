'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Zap, Shield, Brain, CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ValidationRule {
  id: string;
  text: string;
  isValid: boolean;
}

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orbs, setOrbs] = useState<FloatingOrb[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organization: '',
    acceptTerms: false,
  });

  const [passwordValidation, setPasswordValidation] = useState<ValidationRule[]>([
    { id: 'length', text: 'At least 8 characters', isValid: false },
    { id: 'uppercase', text: 'One uppercase letter', isValid: false },
    { id: 'lowercase', text: 'One lowercase letter', isValid: false },
    { id: 'number', text: 'One number', isValid: false },
    { id: 'special', text: 'One special character', isValid: false },
  ]);

  // Generate floating orbs
  useEffect(() => {
    const generateOrbs = () => {
      const colors = ['#00ff88', '#0066cc', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
      const newOrbs: FloatingOrb[] = [];
      for (let i = 0; i < 20; i++) {
        newOrbs.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 10,
        });
      }
      setOrbs(newOrbs);
    };

    generateOrbs();
  }, []);

  // Validate password in real-time
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation([
      { id: 'length', text: 'At least 8 characters', isValid: password.length >= 8 },
      { id: 'uppercase', text: 'One uppercase letter', isValid: /[A-Z]/.test(password) },
      { id: 'lowercase', text: 'One lowercase letter', isValid: /[a-z]/.test(password) },
      { id: 'number', text: 'One number', isValid: /\d/.test(password) },
      { id: 'special', text: 'One special character', isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isPasswordValid = passwordValidation.every(rule => rule.isValid);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        
        {/* Floating Orbs */}
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              backgroundColor: orb.color,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 10, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.8, 0.4, 0.3],
            }}
            transition={{
              duration: 8 + orb.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      {/* Neural Network Animation */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Animated connection lines */}
        <motion.g>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 15}%`}
              y1="20%"
              x2={`${30 + i * 15}%`}
              y2="80%"
              stroke="#00ff88"
              strokeWidth="1"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.g>
      </svg>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                  '0 0 40px rgba(139, 92, 246, 0.6)',
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Join Neural Interface
            </h1>
            <p className="text-slate-400">
              Create your account and unlock the power of AI-assisted clinical care
            </p>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= step ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                  animate={currentStep === step ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-slate-800/20 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">First Name</label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                            placeholder="John"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Last Name</label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          placeholder="john.doe@hospital.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Role</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          required
                        >
                          <option value="">Select Role</option>
                          <option value="physician">Physician</option>
                          <option value="nurse">Nurse</option>
                          <option value="resident">Resident</option>
                          <option value="admin">Administrator</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Organization</label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          placeholder="Hospital/Clinic"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Password Setup */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Secure Your Account</h3>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    {/* Password Validation */}
                    {formData.password && (
                      <motion.div
                        className="bg-slate-700/20 rounded-xl p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <p className="text-sm text-slate-300 mb-3">Password Requirements:</p>
                        <div className="space-y-2">
                          {passwordValidation.map((rule) => (
                            <motion.div
                              key={rule.id}
                              className="flex items-center text-sm"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              {rule.isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                              ) : (
                                <X className="w-4 h-4 text-slate-500 mr-2" />
                              )}
                              <span className={rule.isValid ? 'text-emerald-400' : 'text-slate-400'}>
                                {rule.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
                      <div className="relative group">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 bg-slate-700/30 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            passwordsMatch || !formData.confirmPassword
                              ? 'border-slate-600/50 focus:border-purple-400 focus:ring-purple-400/20'
                              : 'border-red-500/50 focus:border-red-400 focus:ring-red-400/20'
                          }`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {formData.confirmPassword && !passwordsMatch && (
                        <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Terms and Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Almost Done!</h3>

                    {/* Account Summary */}
                    <div className="bg-slate-700/20 rounded-xl p-6 space-y-3">
                      <h4 className="text-lg font-medium text-white mb-3">Account Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Name:</span>
                          <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Email:</span>
                          <p className="text-white font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Role:</span>
                          <p className="text-white font-medium capitalize">{formData.role}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Organization:</span>
                          <p className="text-white font-medium">{formData.organization}</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-purple-500 bg-slate-700/30 border border-slate-600/50 rounded focus:ring-purple-400 focus:ring-2"
                          required
                        />
                        <span className="text-sm text-slate-300 leading-relaxed">
                          I agree to the{' '}
                          <button type="button" className="text-purple-400 hover:text-purple-300 underline">
                            Terms of Service
                          </button>{' '}
                          and{' '}
                          <button type="button" className="text-purple-400 hover:text-purple-300 underline">
                            Privacy Policy
                          </button>
                          . I understand that my data will be processed securely and in accordance with healthcare privacy regulations.
                        </span>
                      </label>
                    </div>

                    {/* Features Preview */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-xl p-6 border border-purple-500/20">
                      <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                        What's Included
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-slate-300">
                          <Zap className="w-4 h-4 text-emerald-400 mr-3" />
                          Real-time AI Analysis
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <Shield className="w-4 h-4 text-blue-400 mr-3" />
                          HIPAA Compliant
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <Brain className="w-4 h-4 text-purple-400 mr-3" />
                          Smart Recommendations
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                          24/7 Support
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Previous
                  </motion.button>
                )}

                <div className="flex-1" />

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.role || !formData.organization)) ||
                      (currentStep === 2 && (!isPasswordValid || !passwordsMatch))
                    }
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <CheckCircle className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}