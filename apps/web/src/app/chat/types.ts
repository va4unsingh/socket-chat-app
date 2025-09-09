export type Message = {
  id: number;
  sender: 'user' | 'stranger' | 'system';
  text?: string;
  reactions?: { [emoji: string]: ('user' | 'stranger')[]; };
  status?: 'sent' | 'delivered' | 'read';
  file?: {
    name: string;
    url: string;
    type: 'image' | 'other';
  };
};

export type ChatStatus = 'idle' | 'searching' | 'chatting' | 'ended';
