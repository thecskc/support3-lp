"use client"

import { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Support3 - ROI Calculator</title>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="20s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="100%;0%;100%"
              dur="20s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)">
              <animate
                attributeName="stop-color"
                values="rgba(59, 130, 246, 0.5);rgba(236, 72, 153, 0.5);rgba(59, 130, 246, 0.5)"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.5)">
              <animate
                attributeName="stop-color"
                values="rgba(236, 72, 153, 0.5);rgba(59, 130, 246, 0.5);rgba(236, 72, 153, 0.5)"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="url(#gradient1)"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function ResultCard({ title, value, description }: { 
  title: string
  value: string
  description: string 
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">
          {value}
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">{description}</p>
      </div>
    </motion.div>
  )
}

function OutcomeCard({ icon, title, description }: { 
  icon: string
  title: string
  description: string 
}) {
  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 flex-shrink-0 w-[280px] md:w-[320px]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="text-neutral-700 dark:text-neutral-300 text-sm">{description}</p>
    </div>
  )
}

export default function ROICalculator() {
  const [teamSize, setTeamSize] = useState<string>("")
  const [supportTeamSize, setSupportTeamSize] = useState<string>("")
  const [revenue, setRevenue] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [results, setResults] = useState<{
    costSavings: string;
    revenueSavings: string;
    explanation: string;
    fullAnalysis?: string;
    fullResponse?: string;
    error?: string;
  } | null>(null)
  const [error, setError] = useState<string>("")
  const [showFullResponse, setShowFullResponse] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'summary' | 'fullAnalysis'>('summary')

  const handleCalculate = async () => {
    // Validate inputs
    if (!teamSize || !supportTeamSize) {
      setError("Team size and support team size are required")
      return
    }

    if (parseInt(teamSize) <= 0 || parseInt(supportTeamSize) <= 0) {
      setError("Team size and support team size must be positive numbers")
      return
    }

    if (revenue && parseInt(revenue) < 0) {
      setError("Revenue must be a positive number")
      return
    }

    setError("")
    setIsCalculating(true)
    setResults(null)
    setShowFullResponse(false)
    setActiveTab('summary')

    try {
      // Call the API endpoint
      const response = await fetch('/api/roi-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamSize,
          supportTeamSize,
          revenue: revenue || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate ROI');
      }

      const data = await response.json();
      
      setResults({
        costSavings: data.costSavings,
        revenueSavings: data.revenueSavings,
        explanation: data.explanation,
        fullAnalysis: data.fullAnalysis,
        fullResponse: data.fullResponse,
        error: data.error
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate ROI. Please try again.")
      console.error(err)
    } finally {
      setIsCalculating(false)
    }
  }

  const formatExplanation = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
    ));
  };

  const title = "ROI Calculator"
  const words = title.split(" ")

  const outcomes = [
    {
      icon: "📈",
      title: "Scale Support Without Hiring Linearly",
      description: "Handle increasing support volume without proportionally increasing headcount, allowing your team to focus on strategic initiatives."
    },
    {
      icon: "⚡",
      title: "Faster Technical Resolutions",
      description: "Deliver higher quality technical support with automated responses to common issues and accelerated resolution paths for complex problems."
    },
    {
      icon: "🛠️",
      title: "Reduced Support Team Workload",
      description: "Automate repetitive tasks and routine inquiries, freeing up your support team to handle high-value interactions and complex issues."
    },
    {
      icon: "🔍",
      title: "Effortless Issue Identification",
      description: "Automatically track and categorize issues across all channels without manual effort, ensuring nothing falls through the cracks."
    },
    {
      icon: "💡",
      title: "Accelerated Product & Revenue Insights",
      description: "Capture and analyze customer feedback faster, delivering actionable insights to product and revenue teams when they matter most."
    }
  ]

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-white dark:bg-neutral-950 py-24 md:py-32">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-12 tracking-tighter text-center">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <p className="text-lg md:text-xl mb-16 text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed text-center">
            Calculate the potential return on investment from implementing Support3 for your organization.
            See how much you could save and gain by automating support tasks and improving customer satisfaction.
          </p>

          {/* Delivered Outcomes Section */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">
                Delivered Outcomes
              </span>
            </h2>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none"></div>
              <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                <div className="flex space-x-4 w-max">
                  {outcomes.map((outcome, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OutcomeCard
                        icon={outcome.icon}
                        title={outcome.title}
                        description={outcome.description}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8 md:p-12 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-size" className="text-base font-medium">
                    Company Size (employees) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="team-size"
                    type="number"
                    placeholder="e.g., 50"
                    value={teamSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamSize(e.target.value)}
                    className="bg-white dark:bg-neutral-800"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-team-size" className="text-base font-medium">
                    Support Team Size <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="support-team-size"
                    type="number"
                    placeholder="e.g., 5"
                    value={supportTeamSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupportTeamSize(e.target.value)}
                    className="bg-white dark:bg-neutral-800"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-base font-medium">
                    Annual Revenue (USD) <span className="text-neutral-500">(optional)</span>
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={revenue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevenue(e.target.value)}
                    className="bg-white dark:bg-neutral-800"
                    min="0"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300"
                  >
                    {isCalculating ? "Calculating..." : "Calculate ROI"}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
          </Card>

          {isCalculating && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
                Calculating your ROI with Claude AI...
              </p>
            </div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {results.error && (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 mb-6">
                  <p className="text-sm mt-1">Using estimated data. For accurate calculations, please try again later.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ResultCard
                  title="Annual Cost Savings"
                  value={results.costSavings}
                  description="Reduction in support costs through automation and efficiency"
                />
                <ResultCard
                  title="Annual Revenue Gains"
                  value={results.revenueSavings}
                  description="Additional revenue from improved customer satisfaction and insights"
                />
              </div>

              <Card className="p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg">
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'summary'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    Summary
                  </button>
                  {results.fullAnalysis && (
                    <button
                      onClick={() => setActiveTab('fullAnalysis')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'fullAnalysis'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      Full Analysis
                    </button>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {activeTab === 'summary' ? 'Analysis Summary' : 'Detailed Analysis'}
                </h3>
                
                <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {activeTab === 'summary' 
                    ? formatExplanation(results.explanation)
                    : formatExplanation(results.fullAnalysis || '')}
                </div>
                
                {results.fullResponse && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowFullResponse(!showFullResponse)}
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {showFullResponse ? "Hide Raw AI Response" : "Show Raw AI Response"}
                    </Button>
                    
                    {showFullResponse && (
                      <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-auto max-h-96">
                        <pre className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300 font-mono">
                          {results.fullResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    Support3 can help you scale your support operations without hiring linearly, while improving customer satisfaction and generating valuable product insights.
                  </p>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  className="py-6 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300"
                  onClick={() => window.open('https://forms.gle/HUuKBhGsimgeVWvH7', '_blank')}
                >
                  <span>Get Started with Support3</span>
                  <span className="ml-3 group-hover:translate-x-1.5 transition-all duration-300">
                    →
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 