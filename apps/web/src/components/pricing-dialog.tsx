
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, MessageCircle, ImageIcon, Zap, ShieldCheck, Crown, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

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

function PricingContent() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleToggle = (isChecked: boolean) => {
        setBillingCycle(isChecked ? 'yearly' : 'monthly');
    };
    
    const currentPlans = plans[billingCycle];

    return (
        <>
         <div className="flex items-center justify-center space-x-4 pt-4 px-6">
            <Label htmlFor="billing-toggle-dialog" className={cn("font-medium", billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
            <Switch 
                id="billing-toggle-dialog" 
                onCheckedChange={handleToggle}
                checked={billingCycle === 'yearly'}
                aria-label="Toggle between monthly and yearly billing"
            />
            <Label htmlFor="billing-toggle-dialog" className={cn("font-medium", billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                Yearly <Badge variant="secondary" className="ml-1 sm:ml-2 bg-primary/20 text-primary animate-pulse">Save 15%</Badge>
            </Label>
        </div>
        
        <ScrollArea className="flex-1 p-6 pt-4">
            <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
                {currentPlans.map((plan) => (
                <Card key={plan.name} className={cn("flex flex-col border", plan.isPopular ? 'border-primary shadow-lg' : 'border-border')}>
                    <CardHeader className="p-6">
                    {plan.isPopular && <Badge variant="default" className="w-fit mb-4 bg-primary text-primary-foreground">Most Popular</Badge>}
                    <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                        <span className="text-lg font-medium text-muted-foreground">{plan.priceFrequency}</span>
                    </div>
                    <CardDescription className="pt-4 text-base text-muted-foreground">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 px-6 pb-6">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold hover:no-underline text-foreground">
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
                    <CardFooter className="p-6 pt-0 mt-auto">
                      <Button className="w-full h-11 text-base" variant={plan.isPopular ? 'default' : 'outline'}>{plan.cta}</Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </ScrollArea>
        </>
    );
}

export function PricingDialog({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
  
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent className="h-[90vh]">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-3xl font-bold tracking-tighter">Upgrade Your Experience</DrawerTitle>
                        <DrawerDescription>Choose the plan that's right for you.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 flex flex-col min-h-0">
                        <PricingContent />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 top-1/2 -translate-y-1/2 h-[85vh] flex flex-col">
        <DialogHeader className="p-6 pb-2 text-center">
          <DialogTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Upgrade Your Experience
          </DialogTitle>
           <DialogDescription className="text-lg text-muted-foreground pt-1">
             Choose the plan that's right for you.
           </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
         <PricingContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
