'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 mb-8">
              <Brain className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Neural Interface
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience the future of AI-powered clinical assistance with our revolutionary neural interface platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                >
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-slate-200 rounded-xl font-semibold hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300"
                >
                  Create Account
                  <Users className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Sparkles className="w-12 h-12 text-emerald-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Insights</h3>
              <p className="text-slate-400">
                Advanced machine learning algorithms provide real-time clinical decision support and diagnostic assistance.
              </p>
            </motion.div>

            <motion.div
              className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Shield className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-3">HIPAA Compliant</h3>
              <p className="text-slate-400">
                Enterprise-grade security ensures patient data privacy and regulatory compliance at all times.
              </p>
            </motion.div>

            <motion.div
              className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Zap className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Processing</h3>
              <p className="text-slate-400">
                Lightning-fast analysis and recommendations delivered instantly to support critical decision making.
              </p>
            </motion.div>
          </motion.div>

          {/* Demo Access */}
          <motion.div
            className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-2xl p-8 border border-emerald-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Try the Demo</h3>
            <p className="text-slate-300 mb-6">
              Experience the full power of our neural interface with no commitment required.
              Use any credentials to explore the platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-300"
              >
                Quick Demo Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-slate-700/50 text-slate-200 rounded-lg font-medium hover:bg-slate-600/50 transition-all duration-300"
              >
                Skip to Main App
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-center text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>© 2025 Neural Interface Platform. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-2">
              <button className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-emerald-400 transition-colors">Terms of Service</button>
              <button className="hover:text-emerald-400 transition-colors">Support</button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}