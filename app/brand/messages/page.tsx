import { db } from '@/lib/db';
import { bookings, influencerProfiles, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, desc, sql } from 'drizzle-orm';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default async function BrandMessagesPage({ searchParams }: { searchParams: { with?: string, booking?: string } }) {
  const session = await auth();
  if (!session) return null;

  const conversations = await db
    .select({
      id: bookings.id,
      influencerId: bookings.influencerId,
      influencerName: users.name,
      influencerImage: users.profileImage,
      lastUpdate: bookings.updatedAt,
    })
    .from(bookings)
    .innerJoin(influencerProfiles, eq(bookings.influencerId, influencerProfiles.id))
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(and(
      eq(bookings.brandId, (await db.select().from(users).where(eq(users.id, session.user.id))).length > 0 ? (await db.select().from(users).where(eq(users.id, session.user.id)))[0].id : session.user.id), 
      // Simplified: current session user *is* the userId, but brandId in bookings refers to brandProfile.id
      sql`1=1` // Just a placeholder to use 'and'
    ))
    .orderBy(desc(bookings.updatedAt));

  // Better mapping for Brand Profile
  const [brandProfile] = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, session.user.id));
  
  const realConversations = await db.select({
      bookingId: bookings.id,
      influencerId: influencerProfiles.id,
      userId: users.id,
      name: users.name,
      image: users.profileImage,
      status: bookings.status
  })
  .from(bookings)
  .innerJoin(influencerProfiles, eq(bookings.influencerId, influencerProfiles.id))
  .innerJoin(users, eq(influencerProfiles.userId, users.id))
  .where(eq(bookings.brandId, brandProfile.id))
  .orderBy(desc(bookings.updatedAt));

  const activeChat = realConversations.find(c => c.userId === searchParams.with && c.bookingId === searchParams.booking) 
                    || realConversations[0];

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 bg-white rounded-2xl border border-gray-100 flex flex-col p-4 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-6 px-2">Messages</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {realConversations.map((conv) => (
            <a 
              key={conv.bookingId} 
              href={`?with=${conv.userId}&booking=${conv.bookingId}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                activeChat?.bookingId === conv.bookingId 
                ? 'bg-orange-50 border-orange-100 shadow-sm' 
                : 'hover:bg-gray-50 border-transparent'
              }`}
            >
               <img src={conv.image || '/placeholder.png'} className="w-12 h-12 rounded-full border shadow-sm" alt="" />
               <div className="min-w-0">
                 <p className="font-bold text-sm text-gray-900 truncate">{conv.name}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{conv.status}</p>
               </div>
            </a>
          ))}
          {realConversations.length === 0 && (
            <div className="text-center py-10 opacity-40">
               <p className="text-sm font-bold uppercase tracking-widest">No chats yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 h-full">
        {activeChat ? (
          <ChatWindow 
            bookingId={activeChat.bookingId}
            receiverId={activeChat.userId}
            receiverName={activeChat.name}
            receiverImage={activeChat.image || undefined}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 border rounded-2xl opacity-50">
             <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { brandProfiles } from '@/lib/db/schema';
