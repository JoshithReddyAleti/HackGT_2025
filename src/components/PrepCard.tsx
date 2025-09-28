'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import '../styles/prepcard-3d.css'
import { 
  Stethoscope, 
  DollarSign, 
  FileText, 
  Clock, 
  Filter, 
  RotateCcw, 
  Eye, 
  Flag, 
  ChevronDown,
  CheckSquare,
  Square,
  MoreHorizontal,
  AlertTriangle,
  ArrowUpDown,
  Sparkles,
  Zap,
  Brain,
  Activity,
  Shield,
  Layers,
  Globe,
  Hexagon
} from 'lucide-react'
import PanelShell from './PanelShell'
import { ConfidenceChip } from './ConfidenceChip'

interface PrepItem {
  id: string
  type: 'icd' | 'cpt' | 'cost' | 'study'
  code?: string
  description: string
  confidence: number
  category?: string
  costBand?: string
  citation?: string
  selected?: boolean
  escalated?: boolean
}

interface PrepCardProps {
  patientId?: string
  loading?: boolean
  onRefresh?: () => void
}

const mockPrepData: PrepItem[] = [
  {
    id: '1',
    type: 'icd',
    code: 'M25.552',
    description: 'Pain in left hip',
    confidence: 0.92,
    category: 'Primary'
  },
  {
    id: '2',
    type: 'icd',
    code: 'Z87.891',
    description: 'Personal history of nicotine dependence',
    confidence: 0.78,
    category: 'Secondary'
  },
  {
    id: '3',
    type: 'cpt',
    code: '73721',
    description: 'MRI lower extremity without contrast',
    confidence: 0.85,
    category: 'Imaging'
  },
  {
    id: '4',
    type: 'cost',
    description: 'Estimated consultation cost',
    confidence: 0.88,
    costBand: '$150-300',
    category: 'Financial'
  },
  {
    id: '5',
    type: 'study',
    description: 'Hip pain management in primary care settings',
    confidence: 0.76,
    citation: 'PMID: 32891234',
    category: 'Evidence'
  }
]

export function PrepCard({ patientId = 'Unknown', loading = false, onRefresh }: PrepCardProps) {
  const [items, setItems] = useState<PrepItem[]>(mockPrepData)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showReasoning, setShowReasoning] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'confidence' | 'type' | 'category'>('confidence')
  const [minConfidence, setMinConfidence] = useState(0.5)
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])
  
  // Motion values for 3D effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15])
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15])
  const springConfig = { stiffness: 100, damping: 30 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  // 3D mouse tracking
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  // Simulate AI analysis
  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => setIsAnalyzing(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isAnalyzing])

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false
      if (item.confidence < minConfidence) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'confidence') return b.confidence - a.confidence
      if (sortBy === 'type') return a.type.localeCompare(b.type)
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '')
      return 0
    })

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)))
    }
  }

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleBulkEscalate = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setItems(items.map(item => 
        selectedItems.has(item.id) 
          ? { ...item, escalated: true }
          : item
      ))
      setSelectedItems(new Set())
    }, 1500)
  }

  const handleAnalyzeAll = () => {
    setIsAnalyzing(true)
    // Simulate AI re-analysis with confidence updates
    setTimeout(() => {
      setItems(items.map(item => ({
        ...item,
        confidence: Math.min(0.98, item.confidence + (Math.random() * 0.1 - 0.05))
      })))
    }, 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'icd': return <Stethoscope className="w-4 h-4" />
      case 'cpt': return <FileText className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'study': return <Eye className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const actions = (
    <div className="flex items-center gap-2">
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-4 h-4 text-cyan-400" />
          </motion.div>
          <span className="text-xs text-cyan-400 font-medium">AI Analyzing...</span>
          <motion.div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
      
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          className="flex items-center gap-2"
        >
          <motion.span 
            className="text-xs text-slate-400 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20"
            animate={{ boxShadow: ["0 0 0 rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.3)", "0 0 0 rgba(16, 185, 129, 0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {selectedItems.size} selected
          </motion.span>
          <motion.button
            onClick={handleBulkEscalate}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 rounded-lg border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300"
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 10px 25px rgba(249, 115, 22, 0.2)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Flag className="w-3 h-3 mr-1 inline" />
            Bulk Escalate
          </motion.button>
        </motion.div>
      )}
      
      <motion.button
        onClick={handleAnalyzeAll}
        className="px-3 py-1.5 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
        whileHover={{ 
          scale: 1.05, 
          rotateX: 5,
          boxShadow: "0 10px 25px rgba(168, 85, 247, 0.2)" 
        }}
        whileTap={{ scale: 0.95 }}
        disabled={isAnalyzing}
      >
        <Sparkles className="w-3 h-3 mr-1 inline" />
        Re-Analyze
      </motion.button>
      
      <motion.button
        onClick={() => setShowFilters(!showFilters)}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group"
        whileHover={{ scale: 1.1, rotateZ: 15 }}
        whileTap={{ scale: 0.9 }}
        title="Filters"
      >
        <motion.div
          animate={showFilters ? { rotateZ: 180 } : { rotateZ: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Filter className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </motion.div>
      </motion.button>
      
      <motion.button
        onClick={onRefresh}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotateZ: -180 }}
        title="Refresh"
      >
        <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
      </motion.button>
    </div>
  )

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d"
      }}
      className="relative"
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 0
            }}
            animate={{ 
              y: [`${particle.y}%`, `${particle.y - 100}%`, `${particle.y}%`],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Neural network lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 15}%`}
              y1="0%"
              x2={`${30 + i * 10}%`}
              y2="100%"
              stroke="url(#neural-gradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </svg>
      </div>

      <PanelShell
        title={
          <motion.div 
            className="flex items-center gap-2"
            animate={isAnalyzing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }}
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Hexagon className="w-5 h-5 text-emerald-400" />
            </motion.div>
            Pre-Visit Autoprep
            {isAnalyzing && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 px-2 py-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full text-xs text-cyan-300 border border-cyan-500/50"
              >
                <Activity className="w-3 h-3 inline mr-1" />
                LIVE
              </motion.div>
            )}
          </motion.div>
        }
        description={`AI-generated insights for Patient ${patientId}`}
        actions={actions}
      >
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
                >
                  <option value="all">All Types</option>
                  <option value="icd">ICD Codes</option>
                  <option value="cpt">CPT Codes</option>
                  <option value="cost">Cost Estimates</option>
                  <option value="study">Studies</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-2 py-1 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
                >
                  <option value="confidence">Confidence</option>
                  <option value="type">Type</option>
                  <option value="category">Category</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Min Confidence</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">{Math.round(minConfidence * 100)}%</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {/* Bulk Selection Header */}
        {filteredItems.length > 0 && (
          <div className="flex items-center gap-2 py-2 border-b border-slate-700/50">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {selectedItems.size === filteredItems.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select All ({filteredItems.length})
            </button>
            
            <button
              onClick={() => setSortBy(sortBy === 'confidence' ? 'type' : 'confidence')}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors ml-auto"
            >
              <ArrowUpDown className="w-3 h-3" />
              Sort
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-slate-700/30 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No items match current filters</p>
            <button
              onClick={() => {
                setFilterType('all')
                setMinConfidence(0)
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  rotateX: -15, 
                  scale: 0.9,
                  z: -50
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0, 
                  scale: 1,
                  z: 0
                }}
                exit={{ 
                  opacity: 0, 
                  y: -50, 
                  rotateX: 15, 
                  scale: 0.9,
                  z: -50
                }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: hoveredItem === item.id ? 2 : 0,
                  z: 10,
                  boxShadow: selectedItems.has(item.id) 
                    ? "0 25px 50px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.1)"
                    : "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(71, 85, 105, 0.1)"
                }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className={`relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group ${
                  selectedItems.has(item.id)
                    ? 'bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-cyan-500/10 border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-gradient-to-br from-slate-700/40 via-slate-600/20 to-slate-700/40 border-slate-600/40 hover:border-slate-500/60'
                } ${item.escalated ? 'ring-2 ring-orange-400/50 shadow-orange-400/20' : ''}`}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Holographic overlay effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -skew-x-12 animate-pulse" />
                </div>
                
                {/* 3D floating elements */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                      z: [0, 20, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="w-3 h-3"
                  >
                    {item.type === 'icd' && <Shield className="w-3 h-3 text-emerald-400/60" />}
                    {item.type === 'cpt' && <Layers className="w-3 h-3 text-blue-400/60" />}
                    {item.type === 'cost' && <Globe className="w-3 h-3 text-yellow-400/60" />}
                    {item.type === 'study' && <Zap className="w-3 h-3 text-purple-400/60" />}
                  </motion.div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <motion.button
                    onClick={() => handleSelectItem(item.id)}
                    className="mt-1"
                    whileHover={{ scale: 1.2, rotateZ: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedItems.has(item.id) ? (
                      <motion.div
                        initial={{ scale: 0, rotateZ: -180 }}
                        animate={{ scale: 1, rotateZ: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckSquare className="w-4 h-4 text-emerald-400 drop-shadow-lg" />
                      </motion.div>
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                    )}
                  </motion.button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ 
                            rotateY: hoveredItem === item.id ? [0, 360] : 0,
                            scale: hoveredItem === item.id ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 1.5 }}
                          className="relative"
                        >
                          {getTypeIcon(item.type)}
                          {hoveredItem === item.id && (
                            <motion.div
                              className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 -z-10"
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                        <motion.span 
                          className="text-sm font-medium text-white"
                          animate={hoveredItem === item.id ? { x: [0, 2, 0] } : { x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.code && (
                            <motion.span 
                              className="font-mono text-emerald-400 relative"
                              animate={isAnalyzing ? { 
                                textShadow: [
                                  "0 0 5px rgba(16, 185, 129, 0.5)",
                                  "0 0 20px rgba(16, 185, 129, 0.8)",
                                  "0 0 5px rgba(16, 185, 129, 0.5)"
                                ]
                              } : {}}
                              transition={{ duration: 1.5, repeat: isAnalyzing ? Infinity : 0 }}
                            >
                              {item.code}
                            </motion.span>
                          )}
                          {item.code && ' - '}
                          {item.description}
                        </motion.span>
                        {item.escalated && (
                          <motion.div 
                            title="Escalated"
                            initial={{ scale: 0, rotateZ: -180 }}
                            animate={{ scale: 1, rotateZ: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Flag className="w-3 h-3 text-orange-400 drop-shadow-glow" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={isAnalyzing ? { 
                            scale: [1, 1.1, 1],
                            rotateY: [0, 180, 360]
                          } : {}}
                          transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }}
                        >
                          <ConfidenceChip confidence={item.confidence} variant="compact" />
                        </motion.div>
                        <motion.button 
                          className="p-1 hover:bg-slate-600/50 rounded group"
                          whileHover={{ scale: 1.2, rotateZ: 90 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <MoreHorizontal className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      {item.category && (
                        <motion.span 
                          className="px-2 py-0.5 bg-gradient-to-r from-slate-600/50 to-slate-500/50 rounded-full border border-slate-500/30 backdrop-blur-sm"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 5px 15px rgba(71, 85, 105, 0.3)",
                            y: -2
                          }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {item.category}
                        </motion.span>
                      )}
                      {item.costBand && (
                        <motion.span 
                          className="text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20"
                          animate={hoveredItem === item.id ? {
                            textShadow: [
                              "0 0 5px rgba(16, 185, 129, 0.5)",
                              "0 0 15px rgba(16, 185, 129, 0.8)",
                              "0 0 5px rgba(16, 185, 129, 0.5)"
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {item.costBand}
                        </motion.span>
                      )}
                      {item.citation && (
                        <motion.span 
                          className="font-mono text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20"
                          whileHover={{ 
                            scale: 1.05,
                            rotateX: 15,
                            textShadow: "0 0 10px rgba(59, 130, 246, 0.6)"
                          }}
                        >
                          {item.citation}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => setShowReasoning(true)}
          className="group px-6 py-3 text-sm bg-gradient-to-r from-slate-700/60 via-slate-600/60 to-slate-700/60 hover:from-slate-600/80 hover:via-slate-500/80 hover:to-slate-600/80 text-slate-300 hover:text-white rounded-xl transition-all duration-300 flex items-center gap-2 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            rotateX: 5,
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(71, 85, 105, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Eye className="w-4 h-4" />
          </motion.div>
          Show Reasoning
        </motion.button>
        
        <motion.button 
          className="group px-6 py-3 text-sm bg-gradient-to-r from-emerald-500/30 via-emerald-400/30 to-emerald-500/30 hover:from-emerald-500/50 hover:via-emerald-400/50 hover:to-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all duration-300 border border-emerald-500/40 hover:border-emerald-400/60 backdrop-blur-sm relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            rotateY: 5,
            boxShadow: "0 15px 35px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block mr-2"
          >
            <Shield className="w-4 h-4" />
          </motion.div>
          Override
        </motion.button>
        
        <motion.button 
          className="group px-6 py-3 text-sm bg-gradient-to-r from-orange-500/30 via-red-500/30 to-orange-500/30 hover:from-orange-500/50 hover:via-red-500/50 hover:to-orange-500/50 text-orange-400 hover:text-orange-300 rounded-xl transition-all duration-300 border border-orange-500/40 hover:border-orange-400/60 backdrop-blur-sm relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            rotateX: -5,
            boxShadow: "0 15px 35px rgba(249, 115, 22, 0.2), 0 0 0 1px rgba(249, 115, 22, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <motion.div
            animate={{ 
              rotateZ: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mr-2"
          >
            <Flag className="w-4 h-4" />
          </motion.div>
          Escalate
        </motion.button>
      </motion.div>

      {/* Reasoning Drawer - Enhanced 3D Modal */}
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowReasoning(false)}
          >
            {/* Floating particles in modal */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0
                  }}
                  animate={{ 
                    y: [null, -100],
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.7, 
                y: 50,
                rotateX: -15,
                rotateY: 10
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: 0,
                rotateY: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.7, 
                y: 50,
                rotateX: 15,
                rotateY: -10
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 border border-slate-600/50 max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Holographic border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-transparent via-transparent to-blue-500/20 animate-pulse" />
              
              {/* Header with 3D effects */}
              <motion.div 
                className="flex items-center justify-between mb-6 relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Brain className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                      AI Reasoning Matrix
                    </h3>
                    <p className="text-sm text-slate-400">Neural network analysis breakdown</p>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={() => setShowReasoning(false)}
                  className="p-3 hover:bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotateZ: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotateZ: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-slate-400 group-hover:text-white text-xl">✕</span>
                  </motion.div>
                </motion.button>
              </motion.div>
              
              {/* Content with enhanced 3D layouts */}
              <div className="space-y-8 text-sm text-slate-300 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="relative p-6 bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm"
                >
                  <motion.h4 
                    className="font-semibold text-white mb-4 flex items-center gap-2"
                    animate={{ textShadow: ["0 0 0px rgba(6, 182, 212, 0)", "0 0 20px rgba(6, 182, 212, 0.6)", "0 0 0px rgba(6, 182, 212, 0)"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Analysis Process
                  </motion.h4>
                  <div className="relative">
                    <p className="leading-relaxed">Based on patient history and symptoms, the AI analyzed multiple data sources to generate these recommendations using advanced neural pathways and clinical decision trees...</p>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-60"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  className="relative p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm"
                >
                  <motion.h4 
                    className="font-semibold text-white mb-4 flex items-center gap-2"
                    animate={{ textShadow: ["0 0 0px rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.6)", "0 0 0px rgba(16, 185, 129, 0)"] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Evidence Sources
                  </motion.h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Electronic Health Records", detail: "Last 12 months", icon: "📋" },
                      { name: "Clinical Decision Support", detail: "Real-time databases", icon: "🧠" },
                      { name: "Medical Literature", detail: "PubMed, Cochrane", icon: "📚" },
                      { name: "Institutional Guidelines", detail: "Latest protocols", icon: "🏥" }
                    ].map((source, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        whileHover={{ 
                          scale: 1.05, 
                          rotateY: 5,
                          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.1)"
                        }}
                        className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/30 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{source.icon}</span>
                          <div>
                            <p className="font-medium text-white group-hover:text-emerald-300 transition-colors">{source.name}</p>
                            <p className="text-xs text-slate-400">{source.detail}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Neural Network Visualization */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
                >
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Hexagon className="w-5 h-5 text-purple-400" />
                    Neural Processing Visualization
                  </h4>
                  <div className="relative h-32 overflow-hidden rounded-xl bg-slate-900/50">
                    <svg className="w-full h-full">
                      {[...Array(8)].map((_, i) => (
                        <motion.circle
                          key={i}
                          cx={`${15 + i * 10}%`}
                          cy="50%"
                          r="3"
                          fill="url(#neural-node-gradient)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.5, 1],
                            opacity: [0, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2, 
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      ))}
                      <defs>
                        <radialGradient id="neural-node-gradient">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PanelShell>
    </motion.div>
  )
}
