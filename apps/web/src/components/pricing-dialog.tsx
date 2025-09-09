'use client';

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
import { plans } from '@/lib/pricing';
import { CheckIcon, X, Star, ShieldCheck, Video, Image as ImageIcon, MessageCircle, Crown, Zap, Filter, History, EyeOff, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, hoverScale, iconHover } from '@/lib/animations';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { LoginDialog } from './login-dialog';



function PricingContent() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [expandedCards, setExpandedCards] = useState<string[]>([]);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);

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

    const handleBuyClick = () => {
        if (!user) {
            setIsLoginDialogOpen(true);
        } else {
            // Proceed to checkout
            console.log('Proceeding to checkout');
        }
    }

    return (
        <>
         <div className="flex items-center justify-center space-x-4 pt-4 px-6">
            <Label htmlFor="billing-toggle-dialog" className={cn("font-medium", billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
            <Switch 
                id="billing-toggle-dialog" 
                onCheckedChange={handleToggle}
                checked={billingCycle === 'yearly'}
                aria-label="Toggle between monthly and yearly billing"
                className="data-[state=checked]:bg-gold"
            />
            <Label htmlFor="billing-toggle-dialog" className={cn("font-medium", billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                Yearly <Badge variant="secondary" className="ml-1 sm:ml-2 bg-primary/20 text-primary animate-pulse">Save 15%</Badge>
            </Label>
        </div>
        
        <ScrollArea className="flex-1 p-6 pt-4">
            <motion.div
              className="mx-auto grid max-w-sm grid-cols-1 gap-8 lg:max-w-5xl md:grid-cols-2 items-start"
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
                        <CardHeader className="p-10">
                            <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                            <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-gray-400">{plan.price}</span>
                                <span className="text-lg font-medium text-muted-foreground">{plan.priceFrequency}</span>
                            </div>
                            <CardDescription className="pt-4 text-base text-muted-foreground h-12">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-10 pt-0">
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
                        <CardFooter className="p-10 pt-0 mt-auto">
                            <Button
                                onClick={handleBuyClick}
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
        </ScrollArea>
        <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
        </>
    );
}

export function PricingDialog({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
  
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent className="h-[70vh] pb-[env(safe-area-inset-bottom)]">
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