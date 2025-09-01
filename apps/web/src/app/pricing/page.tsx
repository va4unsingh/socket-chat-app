

"use client";

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckIcon, Star, ShieldCheck, Video, Image as ImageIcon, MessageCircle, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = {
  monthly: [
    {
      name: 'Basic',
      price: '$4.99',
      priceFrequency: '/month',
      description: 'Unlock essential features to enhance your chatting experience.',
      features: [
        { text: 'Priority Matching', icon: Star },
        { text: 'Advanced Gender Filter', icon: MessageCircle },
        { text: 'Send Images in Chat', icon: ImageIcon },
        { text: 'Basic Profile Badge', icon: Star },
        { text: '10 Custom Interest Slots', icon: Zap },
        { text: 'View Last 5 Matches', icon: MessageCircle },
        { text: 'Ad-Free Experience', icon: ShieldCheck },
      ],
      cta: 'Subscribe to Basic',
    },
    {
      name: 'Pro',
      price: '$8.99',
      priceFrequency: '/month',
      isPopular: true,
      description: 'The ultimate toolkit for the serious chatter, with every feature unlocked.',
      features: [
        { text: 'Highest Priority Matching', icon: Crown },
        { text: 'Advanced Filters (Region, etc.)', icon: MessageCircle },
        { text: 'Send Images, GIFs, & Videos', icon: Video },
        { text: 'Premium Animated Profile Badge', icon: Crown },
        { text: 'Unlimited Interest Slots', icon: Zap },
        { text: 'Full Match History', icon: MessageCircle },
        { text: 'Ad-Free Experience', icon: ShieldCheck },
        { text: 'Private Video Calls', icon: Video },
        { text: 'Enhanced Privacy Controls', icon: ShieldCheck },
      ],
      cta: 'Subscribe to Pro',
    },
  ],
  yearly: [
    {
      name: 'Basic',
      price: '$49.99',
      priceFrequency: '/year',
      description: 'Unlock essential features to enhance your chatting experience.',
      features: [
        { text: 'Priority Matching', icon: Star },
        { text: 'Advanced Gender Filter', icon: MessageCircle },
        { text: 'Send Images in Chat', icon: ImageIcon },
        { text: 'Basic Profile Badge', icon: Star },
        { text: '10 Custom Interest Slots', icon: Zap },
        { text: 'View Last 5 Matches', icon: MessageCircle },
        { text: 'Ad-Free Experience', icon: ShieldCheck },
      ],
      cta: 'Subscribe to Basic',
    },
    {
      name: 'Pro',
      price: '$89.99',
      priceFrequency: '/year',
      isPopular: true,
      description: 'The ultimate toolkit for the serious chatter, with every feature unlocked.',
      features: [
        { text: 'Highest Priority Matching', icon: Crown },
        { text: 'Advanced Filters (Region, etc.)', icon: MessageCircle },
        { text: 'Send Images, GIFs, & Videos', icon: Video },
        { text: 'Premium Animated Profile Badge', icon: Crown },
        { text: 'Unlimited Interest Slots', icon: Zap },
        { text: 'Full Match History', icon: MessageCircle },
        { text: 'Ad-Free Experience', icon: ShieldCheck },
        { text: 'Private Video Calls', icon: Video },
        { text: 'Enhanced Privacy Controls', icon: ShieldCheck },
      ],
      cta: 'Subscribe to Pro',
    },
  ],
};


export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleToggle = (isChecked: boolean) => {
    setBillingCycle(isChecked ? 'yearly' : 'monthly');
  };

  const currentPlans = plans[billingCycle];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-background/95">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary-foreground">
                  Find the Perfect Plan
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Unlock more features and enhance your anonymous conversations. Choose the plan that fits you best.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <Label htmlFor="billing-toggle" className={cn("font-medium", billingCycle === 'monthly' ? 'text-primary-foreground' : 'text-muted-foreground')}>Monthly</Label>
                <Switch 
                  id="billing-toggle" 
                  onCheckedChange={handleToggle}
                  checked={billingCycle === 'yearly'}
                  aria-label="Toggle between monthly and yearly billing"
                />
                <Label htmlFor="billing-toggle" className={cn("font-medium", billingCycle === 'yearly' ? 'text-primary-foreground' : 'text-muted-foreground')}>
                  Yearly <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary animate-pulse">Save 15%</Badge>
                </Label>
              </div>
            </div>
            <div className="mx-auto grid max-w-sm grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-2 mt-16">
              {currentPlans.map((plan) => (
                <Card key={plan.name} className={cn("flex flex-col border bg-card/80 backdrop-blur-md transition-all duration-300", plan.isPopular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border hover:shadow-lg')}>
                  <CardHeader className="p-6">
                    {plan.isPopular && <Badge variant="default" className="w-fit mb-4 bg-primary text-primary-foreground">Most Popular</Badge>}
                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                        <span className="text-lg font-medium text-muted-foreground">{plan.priceFrequency}</span>
                    </div>
                    <CardDescription className="pt-4 text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 px-6 pb-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline">
                          What's Included
                        </AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-4 pt-4">
                            {plan.features.map((feature, index) => (
                               <li key={index} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <feature.icon className="h-4 w-4" />
                                </div>
                                <span className="text-base text-muted-foreground">{feature.text}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full h-12 text-lg" variant={plan.isPopular ? 'default' : 'outline'}>{plan.cta}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
