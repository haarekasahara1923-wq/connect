'use client';

import { useState } from 'react';
import { Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  receiverId: string;
  bookingId: string;
  className?: string;
}

export function VideoCallButton({ receiverId, bookingId, className }: Props) {
  const [inCall, setInCall] = useState(false);

  async function startCall() {
    const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
    
    // Fetch token from local API
    const res = await fetch('/api/zegocloud/token');
    const { token, appId, userId, userName } = await res.json();

    // Use bookingId as roomID to keep it private
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appId,
      token,
      bookingId, 
      userId,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    setInCall(true);
    
    zp.joinRoom({
      container: document.getElementById('video-call-container'),
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      onLeaveRoom: () => setInCall(false),
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={startCall}
        className={`${className} border-orange-200 text-orange-600 hover:bg-orange-50`}
        title="Video Call"
      >
        <Video className="h-4 w-4" />
      </Button>

      {inCall && (
        <div className="fixed inset-0 z-[100] bg-black">
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 text-white z-[110]" 
            onClick={() => setInCall(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div id="video-call-container" className="w-full h-full" />
        </div>
      )}
    </>
  );
}
