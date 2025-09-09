import { CheckIcon, X, Star, ShieldCheck, Video, Image as ImageIcon, MessageCircle, Crown, Zap, Filter, History, EyeOff, ChevronDown } from 'lucide-react';

export const allFeatures = [
  { text: 'Priority Matching', icon: Star, proOnly: false },
  { text: 'Advanced Gender Filter', icon: Filter, proOnly: false },
  { text: 'Send Images in Chat', icon: ImageIcon, proOnly: false },
  { text: 'Basic Profile Badge', icon: Star, proOnly: false },
  { text: 'Highest Priority Matching', icon: Crown, proOnly: true },
  { text: 'Advanced Filters (Region, etc.)', icon: Filter, proOnly: true },
  { text: 'Send Images, GIFs, & Videos', icon: Video, proOnly: true },
  { text: 'Premium Animated Profile Badge', icon: Crown, proOnly: true },
];

export const plans = {
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
