"use client";
import { ChatStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
    status: ChatStatus;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    handleEndChat: () => void;
    handleNextChat: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({ status, inputValue, setInputValue, handleSendMessage, handleEndChat, handleNextChat, fileInputRef, handleFileChange }: ChatInputProps) {
    return (
        <div className="p-4 border-t bg-card/80 backdrop-blur-xl shrink-0">
            <div className="flex w-full items-center space-x-2 md:space-x-4 max-w-4xl mx-auto mb-[env(safe-area-inset-bottom)]">
                <Button variant="outline" onClick={handleEndChat} disabled={status !== 'chatting'}>
                    End
                </Button>
                <Button onClick={handleNextChat} disabled={status === 'searching'}>
                    Next
                </Button>
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf"/>
                    <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={status !== 'chatting'}>
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={status !== 'chatting'}
                    />
                    <Button type="submit" size="icon" disabled={status !== 'chatting' || (!inputValue.trim() && !fileInputRef.current?.files?.length)}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
