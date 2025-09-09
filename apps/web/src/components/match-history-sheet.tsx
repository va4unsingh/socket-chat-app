
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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

const pastMatches = [
    { name: 'PixelPioneer', avatar: 'https://picsum.photos/201', commonInterests: 3, time: '2h ago' },
    { name: 'SynthWaveRider', avatar: 'https://picsum.photos/202', commonInterests: 1, time: '8h ago' },
    { name: 'DataDaemon', avatar: 'https://picsum.photos/203', commonInterests: 5, time: '1d ago' },
    { name: 'GlitchArtisan', avatar: 'https://picsum.photos/204', commonInterests: 2, time: '3d ago' },
]

const chartData = [
  { day: "Monday", chats: 5 },
  { day: "Tuesday", chats: 3 },
  { day: "Wednesday", chats: 6 },
  { day: "Thursday", chats: 4 },
  { day: "Friday", chats: 8 },
  { day: "Saturday", chats: 2 },
  { day: "Sunday", chats: 7 },
]

const chartConfig = {
  chats: {
    label: "Chats",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function MatchHistorySheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-80 top-[3.5rem] h-[calc(100dvh-3.5rem)] flex flex-col" showClose={false}>
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Match History
          </SheetTitle>
          <SheetDescription className="text-xs">
            Your recent matches and activity.
          </SheetDescription>
        </SheetHeader>
        
        <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Weekly Activity</h3>
            <ChartContainer config={chartConfig} className="h-[100px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 1)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="chats" fill="var(--color-chats)" radius={4} />
              </BarChart>
            </ChartContainer>
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          {pastMatches.length > 0 ? (
              <div className="flex flex-col p-2">
                  {pastMatches.map((match, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 cursor-pointer rounded-md">
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
