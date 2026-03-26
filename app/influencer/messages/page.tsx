import { db } from '@/lib/db';
import { bookings, brandProfiles, influencerProfiles, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default async function InfluencerMessagesPage({ searchParams }: { searchParams: { with?: string, booking?: string } }) {
  const session = await auth();
  if (!session) return null;

  // 1. Get Influencer Profile
  const [infProfile] = await db.select().from(influencerProfiles).where(eq(influencerProfiles.userId, session.user.id));
  if (!infProfile) return <div>Please complete your profile first.</div>;

  // 2. Fetch all unique conversations (bookings)
  const realConversations = await db.select({
      bookingId: bookings.id,
      brandId: brandProfiles.id,
      userId: users.id, // Brand's User ID
      name: brandProfiles.companyName,
      image: brandProfiles.logoUrl,
      status: bookings.status
  })
  .from(bookings)
  .innerJoin(brandProfiles, eq(bookings.brandId, brandProfiles.id))
  .innerJoin(users, eq(brandProfiles.userId, users.id))
  .where(eq(bookings.influencerId, infProfile.id))
  .orderBy(desc(bookings.updatedAt));

  const activeChat = realConversations.find(c => c.userId === searchParams.with && c.bookingId === searchParams.booking) 
                    || realConversations[0];

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 bg-white rounded-2xl border border-gray-100 flex flex-col p-4 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-6 px-2">Brand Chats</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {realConversations.map((conv) => (
            <a 
              key={conv.bookingId} 
              href={`?with=${conv.userId}&booking=${conv.bookingId}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                activeChat?.bookingId === conv.bookingId 
                ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                : 'hover:bg-gray-50 border-transparent'
              }`}
            >
               <img src={conv.image || '/placeholder.png'} className="w-12 h-12 rounded-full border shadow-sm object-contain" alt="" />
               <div className="min-w-0">
                 <p className="font-bold text-sm text-gray-900 truncate">{conv.name || 'Brand'}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{conv.status}</p>
               </div>
            </a>
          ))}
          {realConversations.length === 0 && (
            <div className="text-center py-10 opacity-40">
               <p className="text-sm font-bold uppercase tracking-widest">No brand chats yet</p>
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
            receiverName={activeChat.name || 'Brand'}
            receiverImage={activeChat.image || undefined}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 border rounded-2xl opacity-50">
             <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Select a brand to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
