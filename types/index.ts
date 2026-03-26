import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'brand' | 'influencer' | 'admin';
    } & DefaultSession['user'];
  }
}

export type UserRole = 'brand' | 'influencer' | 'admin';

export type InfluencerCategory =
  | 'fashion' | 'food' | 'tech' | 'education' | 'fitness'
  | 'comedy' | 'lifestyle' | 'travel' | 'beauty' | 'gaming'
  | 'business' | 'health' | 'parenting' | 'music' | 'sports';

export const INDIAN_STATES = [
  'Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan',
  'Gujarat', 'Bihar', 'West Bengal', 'Karnataka', 'Tamil Nadu',
  'Andhra Pradesh', 'Telangana', 'Odisha', 'Jharkhand', 'Assam',
  'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Chhattisgarh',
  'Delhi', 'Goa', 'Kerala', 'Jammu & Kashmir',
];

export const TIER2_CITIES = [
  'Bhopal', 'Gwalior', 'Indore', 'Jabalpur', 'Ujjain', 'Sagar',
  'Agra', 'Lucknow', 'Kanpur', 'Varanasi', 'Meerut', 'Allahabad',
  'Surat', 'Vadodara', 'Rajkot', 'Ahmedabad', 'Jaipur', 'Jodhpur',
  'Kota', 'Ajmer', 'Patna', 'Gaya', 'Muzaffarpur', 'Ranchi',
  'Nasik', 'Aurangabad', 'Nagpur', 'Pune', 'Coimbatore', 'Madurai',
  'Vishakhapatnam', 'Vijayawada', 'Mysore', 'Hubli', 'Mangalore',
  'Bhubaneswar', 'Cuttack', 'Raipur', 'Bilaspur', 'Amritsar',
  'Ludhiana', 'Chandigarh', 'Dehradun', 'Haridwar',
];

export const INFLUENCER_CATEGORIES: InfluencerCategory[] = [
  'fashion', 'food', 'tech', 'education', 'fitness',
  'comedy', 'lifestyle', 'travel', 'beauty', 'gaming',
  'business', 'health', 'parenting', 'music', 'sports',
];
