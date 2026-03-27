import { db } from "@/lib/db";
import { influencerProfiles, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Camera, Video, Users, Send, MessageCircle, MessageSquare, Globe } from "lucide-react";
import Link from "next/link";

export default async function AdminInfluencersPage() {
  const influencers = await db.select({
    id: influencerProfiles.id,
    name: users.name,
    email: users.email,
    city: influencerProfiles.city,
    state: influencerProfiles.state,
    address: influencerProfiles.address,
    waNumber: influencerProfiles.whatsappNumber,
    metrics: influencerProfiles.socialMetrics,
    totalReach: influencerProfiles.totalReach,
    status: influencerProfiles.verificationStatus,
    slug: influencerProfiles.slug
  })
  .from(influencerProfiles)
  .innerJoin(users, eq(influencerProfiles.userId, users.id))
  .orderBy(desc(influencerProfiles.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary/20 decoration-8 underline-offset-8">Central Intelligence</h1>
        <p className="text-muted-foreground mt-2 font-bold italic">Real-time monitoring of all creator nodes and private commerce credentials.</p>
      </div>

      <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border p-8 px-10">
          <CardTitle className="text-xl font-black uppercase tracking-tight italic">Influencer Registry</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="px-10 font-black uppercase text-[10px] tracking-widest py-6">Identity</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Geographics & Logistics</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Global Reach</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Node Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.map((inf) => (
                <TableRow key={inf.id} className="border-border/50 group">
                  <TableCell className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-lg font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors cursor-pointer">{inf.name}</span>
                      <span className="text-xs font-bold text-muted-foreground mt-1 lowercase opacity-70">ID: {inf.email}</span>
                      <div className="flex gap-2 mt-4">
                         {(inf.metrics as any)?.instagram?.handle && <Camera className="w-4 h-4 text-pink-500 opacity-60" />}
                         {(inf.metrics as any)?.youtube?.handle && <Video className="w-4 h-4 text-red-500 opacity-60" />}
                         {(inf.metrics as any)?.facebook?.handle && <Users className="w-4 h-4 text-blue-600 opacity-60" />}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-8">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold italic text-foreground/80">
                         <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                         <span>{inf.city}, {inf.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold italic text-muted-foreground">
                         <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                         <span>WhatsApp: {inf.waNumber || 'N/A'}</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground bg-muted/20 p-2 rounded-lg leading-relaxed">{inf.address || 'Logistics center not defined.'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-8">
                     <div className="flex flex-col">
                        <span className="text-2xl font-black italic tracking-tighter text-primary">{(inf.totalReach || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60 italic">Total Global Reach</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-8">
                    <div className="flex flex-col gap-3 items-start">
                        <Badge className={`rounded-lg px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-none select-none ${inf.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                            {inf.status}
                        </Badge>
                        <Link href={`/influencers/${inf.slug}`} target="_blank">
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary italic cursor-pointer hover:underline underline-offset-4 decoration-2">Open Storefront &rarr;</span>
                        </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
