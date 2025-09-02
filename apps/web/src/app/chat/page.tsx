
"use client";
import ChatClient from './chat-client';
import { ChatSidebar } from './chat-sidebar';

export default function ChatPage() {
  return (
    <div className="relative md:grid md:grid-cols-[auto_1fr] h-[100dvh] bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="w-72 lg:w-80 border-r hidden md:block">
            <ChatSidebar strangerName="Stranger" />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <ChatClient />
        </div>
    </div>
  );
}
    
    