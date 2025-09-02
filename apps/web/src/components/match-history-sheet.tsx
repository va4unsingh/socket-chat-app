
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { History, MessageSquareOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

const pastMatches = [
    { name: 'PixelPioneer', avatar: 'https://picsum.photos/201', commonInterests: 3, time: '2h ago' },
    { name: 'SynthWaveRider', avatar: 'https://picsum.photos/202', commonInterests: 1, time: '8h ago' },
    { name: 'DataDaemon', avatar: 'https://picsum.photos/203', commonInterests: 5, time: '1d ago' },
    { name: 'GlitchArtisan', avatar: 'https://picsum.photos/204', commonInterests: 2, time: '3d ago' },
]

export function MatchHistorySheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-72 top-[3.5rem] h-[calc(100dvh-3.5rem)]" showClose={false}>
        <SheetHeader className="p-2 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Match History
          </SheetTitle>
          <SheetDescription className="text-sm">
            Your recent matches. Pro users can see full history.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-4.5rem)]">

        {pastMatches.length > 0 ? (
            <div className="flex flex-col">
                {pastMatches.map((match, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={match.avatar} />
                            <AvatarFallback>{match.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{match.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{match.commonInterests} interests in common</p>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-xs text-muted-foreground">{match.time}</p>
                           <Badge variant="outline" className="mt-1 text-xs">Chat</Badge>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center h-full">
                <MessageSquareOff className="h-10 w-10 mb-4"/>
                <span className="font-semibold text-base">No Match History</span>
                <p className="text-sm">Your recent conversations will appear here.</p>
            </div>
        )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
