import {
  pgTable, text, integer, boolean, timestamp,
  decimal, pgEnum, uuid, jsonb, index
} from 'drizzle-orm/pg-core';

// ─── ENUMS ───────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['brand', 'influencer', 'admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 'accepted', 'in_progress', 'delivered',
  'revision_requested', 'completed', 'cancelled', 'disputed'
]);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'open', 'in_progress', 'completed', 'cancelled']);
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'paid', 'failed']);
export const serviceTypeEnum = pgEnum('service_type', [
  'instagram_post', 'instagram_reel', 'instagram_story',
  'youtube_video', 'youtube_short', 'facebook_post',
  'shoutout_video', 'brand_ambassador', 'event_appearance', 'live_session'
]);

// ─── USERS ───────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'),
  phone: text('phone'),
  role: userRoleEnum('role').notNull().default('brand'),
  profileImage: text('profile_image'),
  isEmailVerified: boolean('is_email_verified').default(false),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  isActive: boolean('is_active').default(true),
  googleId: text('google_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));

// ─── INFLUENCER PROFILES ─────────────────────────────
export const influencerProfiles = pgTable('influencer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  slug: text('slug').unique().notNull(),
  bio: text('bio'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  categories: text('categories').array(),
  languages: text('languages').array(),
  instagramHandle: text('instagram_handle'),
  instagramFollowers: integer('instagram_followers').default(0),
  instagramEngagementRate: decimal('instagram_engagement_rate', { precision: 5, scale: 2 }),
  youtubeHandle: text('youtube_handle'),
  youtubeSubscribers: integer('youtube_subscribers').default(0),
  facebookHandle: text('facebook_handle'),
  facebookFollowers: integer('facebook_followers').default(0),
  totalReach: integer('total_reach').default(0),
  verificationStatus: verificationStatusEnum('verification_status').default('pending'),
  verificationNote: text('verification_note'),
  isVerifiedBadge: boolean('is_verified_badge').default(false),
  isFeatured: boolean('is_featured').default(false),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  totalBookings: integer('total_bookings').default(0),
  portfolioImages: text('portfolio_images').array(),
  portfolioVideos: text('portfolio_videos').array(),
  coverImage: text('cover_image'),
  bankAccountNumber: text('bank_account_number'),
  bankIFSC: text('bank_ifsc'),
  bankAccountName: text('bank_account_name'),
  upiId: text('upi_id'),
  panNumber: text('pan_number'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  slugIdx: index('influencer_slug_idx').on(table.slug),
  cityIdx: index('influencer_city_idx').on(table.city),
  featuredIdx: index('influencer_featured_idx').on(table.isFeatured),
}));

// ─── SERVICES ────────────────────────────────────────
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id, { onDelete: 'cascade' }).notNull(),
  serviceType: serviceTypeEnum('service_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  deliveryDays: integer('delivery_days').default(3),
  revisionsIncluded: integer('revisions_included').default(1),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── BRAND PROFILES ──────────────────────────────────
export const brandProfiles = pgTable('brand_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  companyName: text('company_name'),
  website: text('website'),
  industry: text('industry'),
  city: text('city'),
  state: text('state'),
  gstNumber: text('gst_number'),
  logoUrl: text('logo_url'),
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── CAMPAIGNS ───────────────────────────────────────
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => brandProfiles.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }).notNull(),
  targetCategories: text('target_categories').array(),
  targetCities: text('target_cities').array(),
  targetMinFollowers: integer('target_min_followers'),
  targetMaxFollowers: integer('target_max_followers'),
  requiredDeliverables: text('required_deliverables').array(),
  deadline: timestamp('deadline'),
  status: campaignStatusEnum('status').default('draft'),
  applicationCount: integer('application_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── CAMPAIGN APPLICATIONS ───────────────────────────
export const campaignApplications = pgTable('campaign_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id).notNull(),
  proposedPrice: decimal('proposed_price', { precision: 10, scale: 2 }).notNull(),
  coverNote: text('cover_note'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── BOOKINGS ────────────────────────────────────────
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => brandProfiles.id).notNull(),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  brief: text('brief').notNull(),
  attachments: text('attachments').array(),
  servicePrice: decimal('service_price', { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').default('pending'),
  deadline: timestamp('deadline'),
  acceptedAt: timestamp('accepted_at'),
  deliveredAt: timestamp('delivered_at'),
  completedAt: timestamp('completed_at'),
  deliverables: jsonb('deliverables'),
  revisionCount: integer('revision_count').default(0),
  revisionNote: text('revision_note'),
  paymentId: uuid('payment_id'),
  isPaid: boolean('is_paid').default(false),
  isInfluencerPaid: boolean('is_influencer_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── PAYMENTS ────────────────────────────────────────
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  brandId: uuid('brand_id').references(() => brandProfiles.id),
  razorpayOrderId: text('razorpay_order_id'),
  razorpayPaymentId: text('razorpay_payment_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  status: text('status').default('pending'),
  method: text('method'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── WALLET TRANSACTIONS ─────────────────────────────
export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  referenceId: text('reference_id'),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── REVIEWS ─────────────────────────────────────────
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  brandId: uuid('brand_id').references(() => brandProfiles.id).notNull(),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── MESSAGES ────────────────────────────────────────
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id),
  receiverId: uuid('receiver_id').references(() => users.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  content: text('content'),
  type: text('type').default('text'),
  mediaUrl: text('media_url'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── NOTIFICATIONS ───────────────────────────────────
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: text('type'),
  referenceId: text('reference_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── WISHLIST ────────────────────────────────────────
export const wishlist = pgTable('wishlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => brandProfiles.id),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── PAYOUTS ─────────────────────────────────────────
export const payouts = pgTable('payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  influencerId: uuid('influencer_id').references(() => influencerProfiles.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: payoutStatusEnum('status').default('pending'),
  upiId: text('upi_id'),
  bankAccountNumber: text('bank_account_number'),
  bankIFSC: text('bank_ifsc'),
  transactionRef: text('transaction_ref'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── TYPE EXPORTS ─────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InfluencerProfile = typeof influencerProfiles.$inferSelect;
export type BrandProfile = typeof brandProfiles.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
