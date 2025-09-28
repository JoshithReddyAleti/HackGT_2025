'use client';

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from 'cedar-os';

interface NeuralCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  glowEffect?: boolean;
  onClick?: () => void;
}

export function NeuralCard({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className,
  gradient = false,
  glowEffect = false,
  onClick 
}: NeuralCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2, 
        transition: { duration: 0.2 }
      }}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300',
        gradient 
          ? 'card-gradient' 
          : 'bg-card/60 backdrop-blur-xl border border-border/50',
        glowEffect && 'neural-glow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Neural mesh background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #6366f1 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #a78bfa 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Header */}
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary neural-pulse">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Interactive indicator */}
          {onClick && (
            <motion.div
              className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {children}
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

export function StatsCard({ title, value, change, icon, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-green-400 bg-green-400/10',
    warning: 'text-yellow-400 bg-yellow-400/10',
    danger: 'text-red-400 bg-red-400/10',
  };

  return (
    <NeuralCard
      title={title}
      icon={icon}
      className="h-full"
      gradient
    >
      <div className="space-y-3">
        <div className="text-3xl font-bold text-foreground font-mono">
          {value}
        </div>
        
        {change && (
          <div className="flex items-center gap-2">
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              colorClasses[color]
            )}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </div>
            <span className="text-xs text-muted-foreground">
              {change.label}
            </span>
          </div>
        )}
      </div>
    </NeuralCard>
  );
}