'use client';

import { Header } from '@/components/header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "Can I upgrade or downgrade my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. The changes will be prorated."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and Google Pay."
    },
    {
        question: "Is there a free trial available?",
        answer: "We don't offer a free trial, but we have a free basic version of our app with limited features that you can use for as long as you like."
    },
    {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee on all our plans. If you're not satisfied, you can get a full refund within 30 days of your purchase."
    }
];

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1">
                <section className="w-full py-20 md:py-28 lg:py-36">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                                    Frequently Asked Questions
                                </h1>
                                <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                                    Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                                </p>
                            </div>
                            <div className="w-full max-w-3xl mx-auto pt-8">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqData.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index + 1}`}>
                                            <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-base text-muted-foreground text-left">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
