'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, hoverScale, iconHover } from '@/lib/animations';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, X, Star, ShieldCheck, Video, Image as ImageIcon, MessageCircle, Crown, Zap, Filter, History, EyeOff, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const allFeatures = [
  { text: 'Priority Matching', icon: Star, proOnly: false },
  { text: 'Advanced Gender Filter', icon: Filter, proOnly: false },
  { text: 'Send Images in Chat', icon: ImageIcon, proOnly: false },
  { text: 'Basic Profile Badge', icon: Star, proOnly: false },
  { text: 'Highest Priority Matching', icon: Crown, proOnly: true },
  { text: 'Advanced Filters (Region, etc.)', icon: Filter, proOnly: true },
  { text: 'Send Images, GIFs, & Videos', icon: Video, proOnly: true },
  { text: 'Premium Animated Profile Badge', icon: Crown, proOnly: true },
];

const plans = {
  monthly: [
    {
      name: 'Basic',
      price: '$4.99',
      priceFrequency: '/month',
      description: 'Unlock essential features to enhance your chatting experience.',
      features: allFeatures,
      cta: 'Get Started with Basic',
    },
    {
      name: 'Pro',
      price: '$8.99',
      priceFrequency: '/month',
      isPopular: true,
      description: 'The ultimate toolkit for the serious chatter, with every feature unlocked.',
      features: allFeatures,
      cta: 'Go Pro',
    },
  ],
  yearly: [
    {
      name: 'Basic',
      price: '$49.99',
      priceFrequency: '/year',
      description: 'Unlock essential features to enhance your chatting experience.',
      features: allFeatures,
      cta: 'Get Started with Basic',
    },
    {
      name: 'Pro',
      price: '$89.99',
      priceFrequency: '/year',
      isPopular: true,
      description: 'The ultimate toolkit for the serious chatter, with every feature unlocked.',
      features: allFeatures,
      cta: 'Go Pro',
    },
  ],
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const handleToggle = (isChecked: boolean) => {
    setBillingCycle(isChecked ? 'yearly' : 'monthly');
  };

  const toggleCard = (planName: string) => {
    setExpandedCards(prev => 
        prev.includes(planName) 
            ? prev.filter(name => name !== planName) 
            : [...prev, planName]
    );
  };

  const currentPlans = plans[billingCycle];

  return (
    <div className="flex flex-col min-h-screen bg-animated-gradient text-foreground">
      <Header />
      <main className="flex-1">
        <motion.section
          className="w-full py-20 md:py-28 lg:py-36"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6">
            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-300">
                  Find the Perfect Plan
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Unlock more features and enhance your anonymous conversations. Choose the plan that fits you best.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <Label htmlFor="billing-toggle" className={cn("font-medium text-lg", billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
                <Switch
                  id="billing-toggle"
                  onCheckedChange={handleToggle}
                  checked={billingCycle === 'yearly'}
                  aria-label="Toggle between monthly and yearly billing"
                  className="data-[state=checked]:bg-gold"
                />
                <Label htmlFor="billing-toggle" className={cn("font-medium text-lg", billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                  Yearly <Badge variant="secondary" className="ml-2 bg-gold/20 text-gold animate-pulse">Save 15%</Badge>
                </Label>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-sm grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-2 mt-20 items-start"
              variants={staggerContainer}
            >
              {currentPlans.map((plan) => (
                <motion.div key={plan.name} variants={fadeInUp}>
                  <Card className={cn(
                    "flex flex-col h-full rounded-2xl transition-all duration-300 relative overflow-hidden",
                    plan.isPopular
                      ? 'border-2 border-transparent bg-gradient-to-br from-background to-gold/20'
                      : 'border border-amber-800/30 bg-gradient-to-br from-background to-amber-700/10'
                  )}>
                    {plan.isPopular && (
                        <div className="absolute inset-0 animate-shimmer bg-cover bg-no-repeat" style={{backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, hsl(var(--gold)) 50%, transparent 100%)`}}></div>
                    )}
                    <div className={cn("relative z-10 h-full flex flex-col", plan.isPopular && "bg-background/95 rounded-2xl m-0.5")}>
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 w-32 h-32">
                                <div className="absolute transform rotate-45 bg-gold text-gold-foreground text-center font-semibold py-1 right-[-50px] top-[32px] w-[170px]">
                                    Popular
                                </div>
                            </div>
                        )}
                        <CardHeader className="p-8">
                            <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                            <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-gray-400">{plan.price}</span>
                                <span className="text-lg font-medium text-muted-foreground">{plan.priceFrequency}</span>
                            </div>
                            <CardDescription className="pt-4 text-base text-muted-foreground h-12">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-8 pt-0">
                            <motion.ul className="space-y-4 pt-4">
                            <AnimatePresence>
                                {plan.features.slice(0, expandedCards.includes(plan.name) ? plan.features.length : 5).map((feature) => {
                                    const isFeatureAvailable = !feature.proOnly || plan.name === 'Pro';
                                    return (
                                    <motion.li
                                        key={feature.text}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn("flex items-center gap-3", !isFeatureAvailable && "text-muted-foreground line-through")}
                                    >
                                        <motion.div
                                            className={cn(
                                                "flex h-6 w-6 items-center justify-center rounded-full",
                                                isFeatureAvailable ? "bg-gold/10 text-gold" : "bg-muted/50 text-muted-foreground"
                                            )}
                                            variants={iconHover}
                                            whileHover="hover"
                                        >
                                        {isFeatureAvailable ? <feature.icon className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                        </motion.div>
                                        <span className="text-base">{feature.text}</span>
                                    </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                            </motion.ul>
                            {plan.features.length > 5 && (
                                <Button
                                    variant="link"
                                    className="text-gold hover:text-gold/80 mt-4 p-0"
                                    onClick={() => toggleCard(plan.name)}
                                >
                                    {expandedCards.includes(plan.name) ? 'Show less' : 'Show all features'}
                                    <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", expandedCards.includes(plan.name) && "rotate-180")} />
                                </Button>
                            )}
                        </CardContent>
                        <CardFooter className="p-8 pt-0 mt-auto">
                            <Button
                                className={cn("w-full h-12 text-lg font-semibold", plan.isPopular && "bg-gold hover:bg-gold/90 text-gold-foreground")}
                                variant={plan.isPopular ? 'default' : 'outline'}
                            >
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-16 text-center">
              <Link href="/faq" className="text-lg text-muted-foreground hover:text-gold transition-colors">
                Have more questions? Visit our FAQ page.
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}