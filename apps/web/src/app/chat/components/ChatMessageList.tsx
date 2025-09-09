"use client";
import { Message as MessageType, ChatStatus } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './Message';
import { Bot } from 'lucide-react';

interface ChatMessageListProps {
    messages: MessageType[];
    isStrangerTyping: boolean;
    scrollAreaViewportRef: React.RefObject<HTMLDivElement>;
    username: string;
    avatar?: string | null;
    status: ChatStatus;
    handleReaction: (messageId: number, emoji: string) => void;
}

export function ChatMessageList({ messages, isStrangerTyping, scrollAreaViewportRef, username, avatar, status, handleReaction }: ChatMessageListProps) {
    return (
        <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
            <div className="space-y-4 max-w-4xl mx-auto w-full p-4">
                {messages.map((message) => (
                    <Message key={message.id} message={message} username={username} avatar={avatar} status={status} handleReaction={handleReaction} />
                ))}
                {isStrangerTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
                            <Bot size={20} />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-0"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}
