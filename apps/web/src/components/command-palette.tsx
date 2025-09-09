
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface Command {
  name: string;
  action: () => void;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands: Command[] = [
    {
      name: "Start New Chat",
      action: () => {
        router.push("/chat")
        setIsOpen(false)
      },
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: "Toggle Theme",
      action: () => {
        setTheme(theme === "light" ? "dark" : "light")
      },
      icon: theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
    },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 gap-0 max-w-md">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type a command or search..."
          />
        </div>
        <div className="p-2">
            {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                    <Button
                        key={cmd.name}
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={cmd.action}
                    >
                        {cmd.icon}
                        {cmd.name}
                    </Button>
                ))
            ) : (
                <p className="text-center text-sm text-muted-foreground py-4">No results found.</p>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
