'use server';

import { db } from '@/lib/db';
import { users, brandProfiles, influencerProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['brand', 'influencer']),
  city: z.string().optional(),
  state: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'influencer') {
    if (!data.city) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'City is required for influencers', path: ['city'] });
    }
    if (!data.state) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'State is required for influencers', path: ['state'] });
    }
  }
});

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = registerSchema.safeParse(data);
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { name, email, password, role, city, state } = parsed.data;

  try {
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return { error: 'Email is already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
    }).returning();

    if (role === 'brand') {
      await db.insert(brandProfiles).values({
        userId: newUser.id,
      });
    } else if (role === 'influencer' && city && state) {
      const baseSlug = slugify(name, { lower: true, strict: true });
      const slug = `${baseSlug}-${nanoid(6)}`;
      
      await db.insert(influencerProfiles).values({
        userId: newUser.id,
        slug,
        city,
        state,
      });
    }

  } catch (error) {
    console.error('Registration error', error);
    return { error: 'An unexpected error occurred during registration.' };
  }

  redirect('/login?registered=true');
}
