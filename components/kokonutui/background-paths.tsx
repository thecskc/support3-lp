"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { MouseEvent } from "react"
import Image from "next/image"
import Link from 'next/link'

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
        <title>Support3 - Web3 Technical Support Agent</title>
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

function FeatureCard({
  title,
  description,
  subFeatures,
  imageUrl,
}: {
  title: string
  description: string
  subFeatures: { heading: string; text: string }[]
  imageUrl: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
      className="relative w-full bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-12 md:p-16 hover:shadow-xl transition-shadow duration-300 cursor-pointer group text-left"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="flex flex-col md:flex-row gap-16 items-start"
      >
        <div className="w-full md:w-1/2">
          <div className="relative w-full rounded-xl overflow-hidden">
            <Image 
              src={imageUrl || "/placeholder.svg"} 
              alt={title} 
              width={500}
              height={500}
              className="object-contain w-full"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight text-left">{title}</h3>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed text-left">{description}</p>
          </div>
          
          <div className="space-y-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {subFeatures.map((subFeature, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 text-left">
                  {subFeature.heading}
                </h4>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-left">
                  {subFeature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SecurityFeature({ icon, title, description }: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-sm">{description}</p>
    </div>
  )
}

export default function BackgroundPaths({
  title = `The Technical Support Agent For Web3`,
}: {
  title?: string
}) {
  const words = title.split(" ")

  const features = [
    {
      title: "Add the agent to any channel or platform",
      description:
        "Support3 integrates with conversational channels and support tools, with API access for flexibility.",
      subFeatures: [
        {
          heading: "Optimized for chat platforms",
          text: "Works seamlessly in Telegram, Discord, and Slack to track and manage support requests."
        },
        {
          heading: "Compatible with support tools",
          text: "Can be embedded in platforms like Intercom, Zendesk, and Pylon for better issue tracking."
        },
        {
          heading: "API access for full flexibility",
          text: "Use API access to integrate Support3 into any platform or workflow."
        }
      ],
      imageUrl: "/images/channels.png",
    },
    {
      title: "Automatically track issues and topics of interest",
      description: "Support3 monitors conversations across channels to capture important discussions.",
      subFeatures: [
        {
          heading: "Tracks across public and private channels",
          text: "Identifies bugs, feature requests, support questions, and mentions across community and internal spaces."
        },
        {
          heading: "Organizes and prioritizes automatically",
          text: "Tags issues with priority and category so nothing is overlooked."
        },
        {
          heading: "Ensures nothing slips through",
          text: "Keeps teams informed without requiring manual tracking or message scanning."
        }
      ],
      imageUrl: "/images/issues.png",
    },
    {
      title: "Automatically resolve issues",
      description: "Support3 handles L1 support and helps accelerate complex issue resolution.",
      subFeatures: [
        {
          heading: "Resolves common support questions",
          text: "Uses internal tools and knowledge bases to handle L1 issues automatically."
        },
        {
          heading: "Assists with deeper issue research",
          text: "Gathers relevant information on L2/L3 issues to improve response quality and speed."
        },
        {
          heading: "Frees up the team for critical work",
          text: "Reduces time spent on repetitive queries, allowing teams to focus on higher-value tasks."
        }
      ],
      imageUrl: "/images/resolution.png",
    },
    {
      title: "Works with your tools",
      description: "Support3 automates workflows by integrating with existing systems.",
      subFeatures: [
        {
          heading: "Logs issues in support platforms",
          text: "Automatically creates tickets in tools like Intercom, Zendesk, and Linear."
        },
        {
          heading: "Updates issue trackers and CRMs",
          text: "Ensures important data is logged in platforms like Jira and HubSpot."
        },
        {
          heading: "Reduces manual admin work",
          text: "Automates tedious logging and tracking so teams can focus on customer interactions."
        }
      ],
      imageUrl: "/images/workflow-image.png",
    },
    {
      title: "Actionable insights for product and revenue",
      description: "Support3 helps teams improve products and customer experience.",
      subFeatures: [
        {
          heading: "Aggregates customer feedback",
          text: "Identifies common themes and pain points from conversations."
        },
        {
          heading: "Highlights documentation gaps",
          text: "Surfaces missing or unclear information to improve self-serve support."
        },
        {
          heading: "Helps draft FAQs and responses",
          text: "Generates content based on real customer interactions to enhance support resources."
        }
      ],
      imageUrl: "/images/insight.png",
    }
  ]

  const securityFeatures = [
    {
      icon: "🛡️",
      title: "Enterprise Security",
      description: "All tools used ensure the highest levels of security compliance, providing enterprise-level protection.",
    },
    {
      icon: "🔐",
      title: "Data Encryption",
      description: "Your data is encrypted and protected using industry-leading security standards and best practices.",
    },
    {
      icon: "🏗️",
      title: "Secure Infrastructure",
      description: "Built on enterprise-grade infrastructure with multiple layers of security and redundancy.",
    },
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
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-12 tracking-tighter text-center">
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
            Support3 is a technical support agent for Web3, designed to help you scale support without hiring linearly.
            It monitors customer channels, tracks and prioritizes issues, and resolves technical queries. 
            It also takes autonomous actions across internal tools and seamlessly integrates into your workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <div className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Button
                variant="ghost"
                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 text-black dark:text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10 hover:shadow-md dark:hover:shadow-neutral-800/50 w-full sm:w-auto"
                onClick={() => window.open('https://forms.gle/HUuKBhGsimgeVWvH7', '_blank')}
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Get Started</span>
                <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  →
                </span>
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg mb-32">
            <iframe
              src="https://www.loom.com/embed/6200d1241179478b80ee89599e585ba0?sid=2eeab290-f86a-489f-b98a-199e089f164f"
              frameBorder="0"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>

          </div>

          <div className="grid gap-16 mt-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="w-full max-w-[1400px] mx-auto"
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>

          <div className="w-full max-w-[1400px] mx-auto mt-32 px-6">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Security and Privacy You Can Trust
              </h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
                With our team's experience from building Oxpass.io, we've embedded security and privacy into Support3 from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SecurityFeature {...feature} />
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      <footer className="relative z-10 w-full border-t border-neutral-200 dark:border-neutral-800 mt-32 py-12">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2025 Chennchuu Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link 
                href="https://support3.xyz/privacy" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link 
                href="https://support3.xyz/terms" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

