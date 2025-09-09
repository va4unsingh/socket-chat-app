"use client";
import { Message as MessageType, ChatStatus } from '../types';
import { cn } from '@/lib/utils';
import { Bot, Loader, User, Check, CheckCheck, Smile, File as FileIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

interface MessageProps {
    message: MessageType;
    username: string;
    avatar?: string | null;
    status: ChatStatus;
    handleReaction: (messageId: number, emoji: string) => void;
}

export function Message({ message, username, avatar, status, handleReaction }: MessageProps) {
    return (
        <div key={message.id} className="group relative">
            <div
                className={cn('flex items-end gap-2', {
                    'justify-end': message.sender === 'user',
                    'justify-start': message.sender === 'stranger',
                    'justify-center': message.sender === 'system',
                })}
            >
                {message.sender === 'stranger' && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
                        <Bot size={20} />
                    </div>
                )}
                {message.sender === 'system' ? (
                    <div className="text-xs text-muted-foreground italic px-4 py-1 bg-muted rounded-full flex items-center gap-2">
                        {status === 'searching' && <Loader className="h-4 w-4 animate-spin" />}
                        {message.text}
                    </div>
                ) : (
                    <div className={cn('relative group flex items-center', {
                        'flex-row-reverse': message.sender === 'user'
                    })}>
                        {message.file?.type === 'image' ? (
                            <Image src={message.file.url} alt={message.file.name} width={200} height={200} className="rounded-md" />
                        ) : (
                            <div className={cn('whitespace-pre-wrap rounded-lg px-4 py-2 break-words max-w-[75%] md:max-w-[85%]', {
                                'bg-primary text-primary-foreground': message.sender === 'user',
                                'bg-muted': message.sender === 'stranger',
                            })}>
                                {message.text}
                                {message.file?.type === 'other' && (
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-background/50 mt-2">
                                        <FileIcon className="h-6 w-6" />
                                        <span>{message.file.name}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {message.sender !== 'system' && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn("h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mx-1", {
                                        })}
                                    >
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-1">
                                    <div className="flex gap-1">
                                        {EMOJI_REACTIONS.map(emoji => (
                                            <Button
                                                key={emoji}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => handleReaction(message.id, emoji)}
                                            >
                                                {emoji}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )}
                {message.sender === 'user' && (
                    <div className="flex items-end gap-1">
                        <div className="flex items-center h-8">
                        {message.status === 'read' && <CheckCheck size={16} className="text-blue-500" />}
                        {message.status === 'delivered' && <CheckCheck size={16} className="text-muted-foreground" />}
                        {message.status === 'sent' && <Check size={16} className="text-muted-foreground" />}
                        </div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={avatar || undefined} className="object-cover" />
                            <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
            {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className={cn("flex gap-1 mt-1", {
                    'justify-end pr-10': message.sender === 'user',
                    'justify-start pl-10': message.sender === 'stranger',
                })}>
                    {Object.entries(message.reactions).map(([emoji, senders]) => (
                        <Badge key={emoji} variant="secondary" className="py-0.5 px-1.5 shadow-sm">
                            {emoji} {senders.length > 1 ? <span className="text-xs ml-1">{senders.length}</span> : null}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
