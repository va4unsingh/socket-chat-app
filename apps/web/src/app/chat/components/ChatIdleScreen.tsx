"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/icons';
import { PricingDialog } from '@/components/pricing-dialog';
import { Instagram, Twitter, Tag, Search, X, Gem, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface ChatIdleScreenProps {
    interests: string[];
    interestInput: string;
    setInterestInput: (value: string) => void;
    handleInterestInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    removeInterest: (interest: string) => void;
    gender: string;
    setGender: (gender: string) => void;
    isProUser: boolean;
    handleStartSearch: () => void;
}

export function ChatIdleScreen({
    interests,
    interestInput,
    setInterestInput,
    handleInterestInputKeyDown,
    removeInterest,
    gender,
    setGender,
    isProUser,
    handleStartSearch,
}: ChatIdleScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-y-auto">
            <div className="max-w-xl w-full">
                <div className='flex flex-col items-center justify-center mb-8'>
                    <Logo className="h-20 w-20 text-primary mb-4" />
                    <h2 className="text-4xl font-bold">WhisperLink</h2>
                    <div className="flex gap-4 text-muted-foreground mt-2">
                        <Link href="#" className="transition-colors hover:text-primary"><Instagram /></Link>
                        <Link href="#" className="transition-colors hover:text-primary"><Twitter /></Link>
                    </div>
                </div>

                <Card id="onboarding-interests" className="mb-8 p-6 text-left bg-card/80 backdrop-blur-sm border-primary/20">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Tag className="h-5 w-5" />Interests</h3>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Add an interest..."
                                    className="pl-9"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                    onKeyDown={handleInterestInputKeyDown}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {interests.map(interest => (
                                    <Badge
                                        key={interest}
                                        variant="secondary"
                                        className="py-1 px-2 text-sm rounded-md"
                                    >
                                        {interest}
                                        <button onClick={() => removeInterest(interest)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Press Enter to add a tag.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Looking for...</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {isProUser ? (
                                    <Button variant={gender === 'male' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('male')}>Male</Button>
                                ) : (
                                    <PricingDialog>
                                        <Button variant="outline" size="sm" className="flex-1 text-muted-foreground border-amber-300/30 bg-gradient-to-br from-yellow-300/5 via-amber-300/5 to-orange-300/5 hover:border-amber-300/60 hover:text-foreground transition-all">
                                            <Gem className="mr-2 h-4 w-4 text-amber-400" /> Male
                                        </Button>
                                    </PricingDialog>
                                )}

                                <Button variant={gender === 'both' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('both')}>Both</Button>

                                {isProUser ? (
                                    <Button variant={gender === 'female' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('female')}>Female</Button>
                                ) : (
                                    <PricingDialog>
                                        <Button variant="outline" size="sm" className="flex-1 text-muted-foreground border-amber-300/30 bg-gradient-to-br from-yellow-300/5 via-amber-300/5 to-orange-300/5 hover:border-amber-300/60 hover:text-foreground transition-all">
                                            <Gem className="mr-2 h-4 w-4 text-amber-400" /> Female
                                        </Button>
                                    </PricingDialog>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <Button id="onboarding-start-chat" size="lg" className="h-12 px-8 text-lg w-full" onClick={handleStartSearch}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start Chat
                </Button>
            </div>
        </div>
    )
}
