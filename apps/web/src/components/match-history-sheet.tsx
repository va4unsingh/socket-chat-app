
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
      <SheetContent side="right" className="w-[300px] p-0" showClose={false}>
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Match History
          </SheetTitle>
          <SheetDescription>
            Your recent matches. Pro users can see full history.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-6.5rem)]">

        {pastMatches.length > 0 ? (
            <div className="flex flex-col">
                {pastMatches.map((match, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={match.avatar} />
                            <AvatarFallback>{match.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{match.name}</p>
                            <p className="text-sm text-muted-foreground">{match.commonInterests} interests in common</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-muted-foreground">{match.time}</p>
                           <Badge variant="outline" className="mt-1">Chat</Badge>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center h-full">
                <MessageSquareOff className="h-12 w-12 mb-4"/>
                <span className="font-semibold text-lg">No Match History</span>
                <p className="text-sm">Your recent conversations will appear here.</p>
            </div>
        )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
