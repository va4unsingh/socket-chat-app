'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // New import
import { Mail, Phone, Clock, HelpCircle, Twitter, Instagram, Facebook } from 'lucide-react';

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueType, setIssueType] = useState(''); // New state for issue type

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Here you would typically show a success toast
    // You would also send issueType and file data to your backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-animated-gradient">
      <Header />
      <main className="flex-1 overflow-x-hidden"> {/* Fix: Added overflow-x-hidden here */}
        <motion.section
          className="w-full py-20 md:py-28 lg:py-36"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container px-4 md:px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gold to-amber-300">
                Get in Touch
              </h1>
              <p className="max-w-[700px] mx-auto mt-4 text-lg text-muted-foreground md:text-xl">
                We're here to help with any questions or issues you may have. Reach out to us and we'll get back to you shortly.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 border-border/40 shadow-lg bg-card/60 backdrop-blur-sm"> {/* Enhanced Card styling */}
                  <CardContent className="p-0">
                    <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2> {/* More prominent header */}
                    <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y for better visual separation */}
                      <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0"> {/* Two-column layout for name/email */}
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Full Name</Label>
                          <Input id="name" placeholder="e.g., Jane Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Your Email Address</Label>
                          <Input id="email" type="email" placeholder="e.g., jane.doe@example.com" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueType">What can we help you with?</Label>
                        <Select onValueChange={setIssueType} value={issueType} required>
                          <SelectTrigger id="issueType">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Inquiry</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback / Suggestion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="attachment">Attach a file (optional)</Label>
                        <Input id="attachment" type="file" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea id="message" placeholder="Please describe your issue or question in detail..." className="min-h-[150px] resize-none" required />
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-semibold bg-gold text-gold-foreground hover:bg-gold/90" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        We typically respond within 24-48 business hours.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-8 relative">
                 <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10"></div>
                 <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10"></div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-gold" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <a href="mailto:support@example.com" className="text-muted-foreground hover:text-gold">support@example.com</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-gold" />
                        <div>
                            <h3 className="font-semibold">Phone</h3>
                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-gold" />
                        <div>
                            <h3 className="font-semibold">Business Hours</h3>
                            <p className="text-muted-foreground">Monday - Friday: 9am to 5pm</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <HelpCircle className="w-6 h-6 text-gold" />
                        <div>
                            <h3 className="font-semibold">Self-Help</h3>
                            <Link href="/knowledge-base" className="text-muted-foreground hover:text-gold">Visit our Knowledge Base</Link>
                        </div>
                    </div>
                </div>
                <div className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-muted-foreground hover:text-gold"><Twitter /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-gold"><Facebook /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-gold"><Instagram /></Link>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
