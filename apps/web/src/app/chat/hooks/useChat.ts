"use client";
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Message, ChatStatus } from '../types';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

export function useChat() {
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [strangerName, setStrangerName] = useState('Stranger');
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isStrangerTyping]);

  const addMessage = (message: Omit<Message, 'id' | 'reactions'>) => {
    const newMessage: Message = {
      id: Date.now(),
      ...message,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleStartSearch = () => {
    setMessages([]);
    setStatus('searching');
    addMessage({ text: 'Finding a stranger with similar interests...', sender: 'system' });
    // Simulate finding a match
    setTimeout(() => {
        const randomNames = ['CyberNomad', 'PixelPioneer', 'GlitchArtisan', 'DataDaemon', 'SynthWaveRider'];
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        setStrangerName(name);
        setStatus('chatting');
        addMessage({ text: `You have connected with ${name}. Say hi!`, sender: 'system' });
    }, 2500);
  };

  const handleEndChat = () => {
    if (status === 'chatting') {
      addMessage({ text: 'You have disconnected.', sender: 'system' });
      setStatus('ended');
    }
  };
  
  const handleNextChat = () => {
     if (status === 'chatting' || status === 'ended') {
        handleStartSearch();
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || status !== 'chatting') return;
    const messageId = addMessage({ text: inputValue, sender: 'user', status: 'sent' });
    setInputValue('');

    // Simulate delivery and read receipts
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m));
    }, 600);

    const typingDuration = 1200 + Math.random() * 1000;
    
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' } : m));
        setIsStrangerTyping(true);
    }, 1500)

    setTimeout(() => {
      setIsStrangerTyping(false); 
      addMessage({ text: 'This is a simulated response from the stranger.', sender: 'stranger' });
    }, 1500 + typingDuration);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : 'other';

    addMessage({
      sender: 'user',
      status: 'sent',
      file: {
        name: file.name,
        url: fileUrl,
        type: fileType,
      },
    });
    
    // Reset file input
    e.target.value = '';
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const newReactions = { ...(msg.reactions || {}) };

        // Find if the user has an existing reaction
        const userExistingReaction = Object.entries(newReactions).find(([_, senders]) => senders.includes('user'));

        // If user has an existing reaction, remove it
        if (userExistingReaction) {
          const [existingEmoji] = userExistingReaction;
          newReactions[existingEmoji] = newReactions[existingEmoji].filter(r => r !== 'user');
          if (newReactions[existingEmoji].length === 0) {
            delete newReactions[existingEmoji];
          }
        }

        // If the clicked emoji is different from the one they had, or if they had none, add the new one.
        if (!userExistingReaction || userExistingReaction[0] !== emoji) {
          if (!newReactions[emoji]) {
            newReactions[emoji] = [];
          }
          newReactions[emoji].push('user');
        }

        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));

    // Simulate stranger reacting back
    if (Math.random() > 0.5) {
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.map(msg => {
                if (msg.id === messageId) {
                    const newReactions = { ...(msg.reactions || {}) };
                    const randomEmoji = EMOJI_REACTIONS[Math.floor(Math.random() * EMOJI_REACTIONS.length)];
                    
                    if (!newReactions[randomEmoji]) {
                        newReactions[randomEmoji] = [];
                    }
                    if (!newReactions[randomEmoji].includes('stranger')) {
                        newReactions[randomEmoji].push('stranger');
                    }
                    return { ...msg, reactions: newReactions };
                }
                return msg;
            }));
        }, 800);
    }
  };

  return {
    status,
    messages,
    inputValue,
    setInputValue,
    strangerName,
    scrollAreaViewportRef,
    isStrangerTyping,
    fileInputRef,
    handleStartSearch,
    handleEndChat,
    handleNextChat,
_handleSendMessage,
    handleFileChange,
    handleReaction,
  };
}
