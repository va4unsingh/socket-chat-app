"use client";

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useChat } from './hooks/useChat';
import { useInterests } from './hooks/useInterests';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { ChatIdleScreen } from './components/ChatIdleScreen';

export default function ChatClient() {
  const user = useSelector((state: RootState) => state.user.user);
  const username = user?.username || 'User';
  const avatar = user?.avatar;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [gender, setGender] = useState('both');
  const isProUser = false; // Placeholder for user's subscription status

  const {
    interests,
    interestInput,
    setInterestInput,
    handleInterestInputKeyDown,
    removeInterest,
  } = useInterests();

  const {
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
    handleSendMessage,
    handleFileChange,
    handleReaction,
  } = useChat();

  return (
    <div className="h-full bg-background/90 relative flex flex-col">
      {status === 'idle' ? (
        <ChatIdleScreen
          interests={interests}
          interestInput={interestInput}
          setInterestInput={setInterestInput}
          handleInterestInputKeyDown={handleInterestInputKeyDown}
          removeInterest={removeInterest}
          gender={gender}
          setGender={setGender}
          isProUser={isProUser}
          handleStartSearch={handleStartSearch}
        />
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader
            status={status}
            strangerName={strangerName}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
          />
          <ChatMessageList
            messages={messages}
            isStrangerTyping={isStrangerTyping}
            scrollAreaViewportRef={scrollAreaViewportRef}
            username={username}
            avatar={avatar}
            status={status}
            handleReaction={handleReaction}
          />
          <ChatInput
            status={status}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            handleEndChat={handleEndChat}
            handleNextChat={handleNextChat}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
