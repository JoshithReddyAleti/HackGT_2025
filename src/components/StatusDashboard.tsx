'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Zap, 
  MessageSquare, 
  Activity, 
  Clock,
  TrendingUp,
  Database,
  Cpu,
  MemoryStick,
  Wifi,
  Bot,
  User2,
  ArrowRight
} from 'lucide-react';
import { NeuralCard, StatsCard } from './NeuralCard';
import { AppointmentScheduler } from './AppointmentScheduler';
import { PrepCard } from './PrepCard';
import { RelevanceDigest } from './RelevanceDigest';
import { EscalationInbox } from './EscalationInbox';
import { cn } from 'cedar-os';

interface StatusDashboardProps {
  mainText: string;
  textLines: string[];
  onTextLinesClear: () => void;
}

export function StatusDashboard({ mainText, textLines, onTextLinesClear }: StatusDashboardProps) {
  const [activeMetrics, setActiveMetrics] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [responseTime, setResponseTime] = useState(120);

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 8)));
      setMemoryUsage(prev => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 5)));
      setResponseTime(prev => Math.max(80, Math.min(200, prev + (Math.random() - 0.5) * 20)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Appointment Scheduler - Full Width */}
      <AppointmentScheduler />
      
      {/* Clinical Copilot Enhancement Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <PrepCard patientId="PT-2024-001" />
        <RelevanceDigest patientId="PT-2024-001" />
        <EscalationInbox />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Display */}
          <NeuralCard
          title="Neural Output Display"
          subtitle="Current AI-generated content"
          icon={<Brain className="w-5 h-5" />}
          gradient
          glowEffect
        >
          <div className="space-y-4">
            <motion.div
              key={mainText}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent neural-pulse mt-2" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Active Neural Response
                  </p>
                  <h2 className="text-2xl font-bold text-foreground leading-tight">
                    {mainText}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Bot className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">
                  Generated via Cedar state setter
                </span>
              </div>
            </motion.div>

            {/* Dynamic Content Stream */}
            <AnimatePresence>
              {textLines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <h3 className="font-medium text-foreground">Content Stream</h3>
                      <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                        {textLines.length} items
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onTextLinesClear}
                      className="px-3 py-1 text-xs bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    >
                      Clear All
                    </motion.button>
                  </div>

                  <div className="grid gap-2">
                    {textLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-3 rounded-lg bg-card/40 border border-border/30 hover:border-accent/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-foreground">
                              {line.startsWith('**') && line.endsWith('**') ? (
                                <strong className="text-accent">{line.slice(2, -2)}</strong>
                              ) : line.startsWith('*') && line.endsWith('*') ? (
                                <em className="text-primary">{line.slice(1, -1)}</em>
                              ) : line.startsWith('🌟') ? (
                                <span className="text-yellow-400 font-semibold">{line}</span>
                              ) : (
                                <span>{line}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NeuralCard>

        {/* AI Instructions Panel */}
        <NeuralCard
          title="Neural Interface Instructions"
          subtitle="Interact with the AI system using natural language"
          icon={<User2 className="w-5 h-5" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                Text Manipulation
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  "Change the main text to..."
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  "Update the display message"
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                Content Generation
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  "Add new text with bold styling"
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  "Create highlighted content"
                </li>
              </ul>
            </div>
          </div>
        </NeuralCard>
      </div>

      {/* Sidebar Stats */}
      <div className="space-y-6">
        {/* System Metrics */}
        <div className="grid gap-4">
          <StatsCard
            title="CPU Usage"
            value={`${cpuUsage}%`}
            change={{ value: 2.3, label: 'vs last hour' }}
            icon={<Cpu className="w-4 h-4" />}
            color="primary"
          />
          
          <StatsCard
            title="Memory"
            value={`${memoryUsage}%`}
            change={{ value: -1.2, label: 'vs last hour' }}
            icon={<MemoryStick className="w-4 h-4" />}
            color="accent"
          />
          
          <StatsCard
            title="Response Time"
            value={`${responseTime}ms`}
            change={{ value: -5.7, label: 'improvement' }}
            icon={<Activity className="w-4 h-4" />}
            color="success"
          />
        </div>

        {/* Activity Feed */}
        <NeuralCard
          title="Activity Monitor"
          subtitle="Real-time system events"
          icon={<Clock className="w-4 h-4" />}
        >
          <div className="space-y-3">
            {[
              { time: '12:34:56', event: 'Text state updated', type: 'success' },
              { time: '12:34:45', event: 'AI response generated', type: 'info' },
              { time: '12:34:32', event: 'User interaction detected', type: 'primary' },
              { time: '12:34:20', event: 'System health check', type: 'muted' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  item.type === 'success' && 'bg-green-400',
                  item.type === 'info' && 'bg-blue-400',
                  item.type === 'primary' && 'bg-primary',
                  item.type === 'muted' && 'bg-muted-foreground'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{item.event}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </NeuralCard>
      </div>
    </div>
    </div>
  );
}