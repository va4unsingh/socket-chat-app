"use client";
import { useState, KeyboardEvent } from 'react';

export function useInterests(initialInterests: string[] = ['Chatting']) {
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [interestInput, setInterestInput] = useState('');

  const handleInterestInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && interestInput.trim() !== '') {
      e.preventDefault();
      const newInterest = interestInput.trim();
      if (!interests.includes(newInterest)) {
        setInterests((prev) => [...prev, newInterest]);
      }
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests((prev) => prev.filter((i) => i !== interestToRemove));
  };

  return {
    interests,
    interestInput,
    setInterestInput,
    handleInterestInputKeyDown,
    removeInterest,
  };
}
