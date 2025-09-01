
'use client';

import { Header } from '@/components/header';
import dynamic from 'next/dynamic'; // New import for dynamic
import { staggerContainer, fadeInUp } from '@/lib/animations';
import Link from 'next/link';

// Dynamically import motion.div with ssr: false
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
const MotionSection = dynamic(() => import('framer-motion').then(mod => mod.motion.section), { ssr: false });

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col min-h-screen bg-animated-gradient">
      <Header />
      <main className="flex-1">
        <MotionSection // Changed from motion.section
          className="w-full py-16 md:py-24 lg:py-32"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6 text-center">
            <MotionDiv variants={fadeInUp}> {/* Changed from motion.div */}
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-300">
                Knowledge Base
              </h1>
              <p className="max-w-[900px] mx-auto mt-4 text-lg text-muted-foreground md:text-xl">
                Find answers to common questions and learn more about our services.
              </p>
            </MotionDiv>

            <MotionDiv variants={fadeInUp} className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"> {/* Changed from motion.div */}
              {/* Placeholder for Knowledge Base Categories/Articles */}
              <Link href="/knowledge-base/getting-started" className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card/50">
                <h2 className="text-xl font-semibold text-foreground">Getting Started</h2>
                <p className="text-muted-foreground mt-2">Learn how to set up your account and start chatting.</p>
              </Link>
              <Link href="/knowledge-base/troubleshooting" className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card/50">
                <h2 className="text-xl font-semibold text-foreground">Troubleshooting</h2>
                <p className="text-muted-foreground mt-2">Solutions for common issues and technical problems.</p>
              </Link>
              <Link href="/knowledge-base/billing-payments" className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card/50">
                <h2 className="text-xl font-semibold text-foreground">Billing & Payments</h2>
                <p className="text-muted-foreground mt-2">Information about subscriptions, payments, and refunds.</p>
              </Link>
            </MotionDiv>

            <MotionDiv variants={fadeInUp} className="mt-16 text-center"> {/* Changed from motion.div */}
              <p className="text-lg text-muted-foreground">
                Can't find what you're looking for? <Link href="/support" className="text-gold hover:text-gold/80">Contact Support</Link>.
              </p>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
    </div>
  );
}
