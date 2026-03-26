'use client';

import { useEffect, useRef, useState } from 'react';
import ZIM from 'zego-zim-web';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { VideoCallButton } from './VideoCallButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image';
}

interface Props {
  bookingId: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

export function ChatWindow({ bookingId, receiverId, receiverName, receiverImage }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [zimClient, setZimClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initZegoChat();
    return () => { 
      if (zimClient) zimClient.destroy(); 
    };
  }, []);

  async function initZegoChat() {
    try {
      // 1. Fetch token from our API
      const res = await fetch('/api/zegocloud/token');
      const { token, appId, userId, userName } = await res.json();
      if (!appId) return;

      // 2. Initialize ZIM
      const zim = ZIM.create({ appID: appId });
      
      // 3. Set event handlers
      zim.on('receivePeerMessage', (zimInstance: any, { messageList }: any) => {
        const newMsgs = messageList.map((m: any) => ({
          senderId: m.senderUserID,
          content: m.message,
          timestamp: m.timestamp,
          type: 'text' as const,
        }));
        setMessages(prev => [...prev, ...newMsgs]);
      });

      // 4. Login
      await zim.login({ userID: userId, userName }, token);
      
      setZimClient(zim);
      setLoading(false);
      scrollToBottom();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !zimClient) return;
    
    try {
      const msg = { message: input, type: 1 }; // type 1 = text
      await zimClient.sendPeerMessage(msg, receiverId, { priority: 1 });
      
      setMessages(prev => [...prev, {
        senderId: 'me',
        content: input,
        timestamp: Date.now(),
        type: 'text',
      }]);
      setInput('');
      scrollToBottom();
    } catch (e) {
      console.error('Failed to send message', e);
    }
  }

  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <Loader2 className="w-10 h-10 animate-spin text-orange-400 mb-4" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Secure Connection Establishing...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full border rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-100 relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
        <div className="sm:hidden">
           <ArrowLeft className="w-5 h-5 text-gray-400" />
        </div>
        <Avatar className="w-10 h-10 ring-2 ring-orange-100 ring-offset-2">
          <AvatarImage src={receiverImage} />
          <AvatarFallback className="bg-orange-50 text-orange-700 font-black">{receiverName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm text-gray-900 truncate">{receiverName}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-200" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Collaboration</p>
          </div>
        </div>
        <VideoCallButton receiverId={receiverId} bookingId={bookingId} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[url('https://res.cloudinary.com/drkvu4vpt/image/upload/v1711200000/chat-bg.png')] bg-repeat bg-opacity-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${
              msg.senderId === 'me' 
                ? 'bg-orange-600 text-white rounded-br-sm' 
                : 'bg-white border text-gray-800 rounded-bl-sm border-gray-100'
            }`}>
              <div className="font-medium whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[9px] mt-1 text-right opacity-70 ${msg.senderId === 'me' ? 'text-white' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center gap-4 py-20">
             <div className="p-4 bg-orange-50 rounded-full"><Send className="w-12 h-12 text-orange-200" /></div>
             <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Start discussing your project requirements</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50/80 backdrop-blur-md border-t flex gap-3 items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Apna message likhein..."
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all shadow-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-orange-600 text-white rounded-2xl p-3.5 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-orange-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
