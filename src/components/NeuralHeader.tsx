'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Activity, 
  Wifi, 
  WifiOff, 
  Settings, 
  User, 
  Zap,
  MessageCircle,
  PanelRight,
  Type 
} from 'lucide-react';

type ChatMode = 'floating' | 'sidepanel' | 'caption';

interface NeuralHeaderProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function NeuralHeader({ currentMode, onModeChange }: NeuralHeaderProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [systemLoad, setSystemLoad] = useState(67);

  // Simulate dynamic system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.max(30, Math.min(100, prev + (Math.random() - 0.5) * 10)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const modes = [
    {
      id: 'caption' as const,
      label: 'Caption',
      icon: <Type className="w-4 h-4" />,
      description: 'Overlay interface mode',
    },
    {
      id: 'floating' as const,
      label: 'Floating',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Resizable floating panel',
    },
    {
      id: 'sidepanel' as const,
      label: 'Docked',
      icon: <PanelRight className="w-4 h-4" />,
      description: 'Integrated side panel',
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & System Status */}
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <Brain className="w-8 h-8 text-primary neural-pulse" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md neural-glow" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-foreground">Neural Interface</h1>
                <p className="text-xs text-muted-foreground">Cedar AI System</p>
              </div>
            </motion.div>

            {/* System Metrics */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 backdrop-blur-sm">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm font-mono text-foreground">
                  {systemLoad}% Load
                </span>
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${systemLoad}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 backdrop-blur-sm">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interface Mode Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-muted/30 backdrop-blur-sm rounded-xl border border-border/50">
              {modes.map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${currentMode === mode.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={mode.description}
                >
                  {mode.icon}
                  <span className="hidden sm:block">{mode.label}</span>
                </motion.button>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="System Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="User Profile"
              >
                <User className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Neural Activity Indicator */}
        <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-accent to-transparent data-flow"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.header>
  );
}