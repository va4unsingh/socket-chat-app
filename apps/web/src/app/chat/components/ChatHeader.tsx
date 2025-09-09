"use client";
import { ChatStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { FriendRequestDialog } from '@/components/friend-request-dialog';
import { NotificationsDialog } from '@/components/notifications-dialog';
import { MatchHistorySheet } from '@/components/match-history-sheet';
import { ChatSidebar } from '../chat-sidebar';
import { PanelLeft, X, UserPlus, Bell, History } from 'lucide-react';

interface ChatHeaderProps {
    status: ChatStatus;
    strangerName: string;
    isSheetOpen: boolean;
    setIsSheetOpen: (isOpen: boolean) => void;
}

export function ChatHeader({ status, strangerName, isSheetOpen, setIsSheetOpen }: ChatHeaderProps) {
    return (
        <div className="h-14 px-4 flex items-center justify-between bg-card/80 backdrop-blur-xl border-b z-10 shrink-0">
            <div className="flex items-center gap-2">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <div className="md:hidden">
                        {isSheetOpen ? (
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon" className="[&_svg]:size-5">
                                    <X />
                                </Button>
                            </SheetClose>
                        ) : (
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="[&_svg]:size-5">
                                    <PanelLeft />
                                </Button>
                            </SheetTrigger>
                        )}
                    </div>
                    <SheetContent side="left" className="w-72 lg:w-80 p-0 top-[3.5rem] h-[calc(100dvh-3.5rem)]" showClose={false}>
                        <SheetHeader className="sr-only">
                            <SheetTitle>Chat Sidebar</SheetTitle>
                            <SheetDescription>
                                Contains chat lists, friend lists, and user profile information.
                            </SheetDescription>
                        </SheetHeader>
                        <ChatSidebar strangerName="Stranger" />
                    </SheetContent>
                </Sheet>
                <div className="font-bold text-lg">
                    {status === 'chatting' ? `@${strangerName}` : 'Connecting...'}
                </div>
            </div>
            <div className="flex items-center gap-1">
                <FriendRequestDialog>
                    <Button variant="ghost" size="icon" className="[&_svg]:size-5"><UserPlus /></Button>
                </FriendRequestDialog>
                <NotificationsDialog>
                    <Button variant="ghost" size="icon" className="[&_svg]:size-5"><Bell /></Button>
                </NotificationsDialog>
                <MatchHistorySheet>
                    <Button variant="ghost" size="icon" className="[&_svg]:size-5"><History /></Button>
                </MatchHistorySheet>
            </div>
        </div>
    )
}
