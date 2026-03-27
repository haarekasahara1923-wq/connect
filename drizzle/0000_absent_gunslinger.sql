CREATE TYPE "public"."booking_status" AS ENUM('pending', 'accepted', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('instagram_post', 'instagram_reel', 'instagram_story', 'youtube_video', 'youtube_short', 'facebook_post', 'shoutout_video', 'brand_ambassador', 'event_appearance', 'live_session');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('brand', 'influencer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"campaign_id" uuid,
	"brief" text NOT NULL,
	"attachments" text[],
	"service_price" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" "booking_status" DEFAULT 'pending',
	"deadline" timestamp,
	"accepted_at" timestamp,
	"delivered_at" timestamp,
	"completed_at" timestamp,
	"deliverables" jsonb,
	"revision_count" integer DEFAULT 0,
	"revision_note" text,
	"payment_id" uuid,
	"is_paid" boolean DEFAULT false,
	"is_influencer_paid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" text,
	"website" text,
	"industry" text,
	"city" text,
	"state" text,
	"gst_number" text,
	"logo_url" text,
	"wallet_balance" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaign_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"proposed_price" numeric(10, 2) NOT NULL,
	"cover_note" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"target_categories" text[],
	"target_cities" text[],
	"target_min_followers" integer,
	"target_max_followers" integer,
	"required_deliverables" text[],
	"deadline" timestamp,
	"status" "campaign_status" DEFAULT 'draft',
	"application_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "influencer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"categories" text[],
	"languages" text[],
	"instagram_handle" text,
	"instagram_followers" integer DEFAULT 0,
	"instagram_engagement_rate" numeric(5, 2),
	"youtube_handle" text,
	"youtube_subscribers" integer DEFAULT 0,
	"facebook_handle" text,
	"facebook_followers" integer DEFAULT 0,
	"total_reach" integer DEFAULT 0,
	"verification_status" "verification_status" DEFAULT 'pending',
	"verification_note" text,
	"is_verified_badge" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"average_rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"total_bookings" integer DEFAULT 0,
	"portfolio_images" text[],
	"portfolio_videos" text[],
	"cover_image" text,
	"bank_account_number" text,
	"bank_ifsc" text,
	"bank_account_name" text,
	"upi_id" text,
	"pan_number" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "influencer_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid,
	"receiver_id" uuid,
	"booking_id" uuid,
	"content" text,
	"type" text DEFAULT 'text',
	"media_url" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"type" text,
	"reference_id" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"brand_id" uuid,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'INR',
	"status" text DEFAULT 'pending',
	"method" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"influencer_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"status" "payout_status" DEFAULT 'pending',
	"upi_id" text,
	"bank_account_number" text,
	"bank_ifsc" text,
	"transaction_ref" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"influencer_id" uuid NOT NULL,
	"service_type" "service_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"delivery_days" integer DEFAULT 3,
	"revisions_included" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"phone" text,
	"role" "user_role" DEFAULT 'brand' NOT NULL,
	"profile_image" text,
	"is_email_verified" boolean DEFAULT false,
	"is_phone_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"google_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"reference_id" text,
	"balance_after" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid,
	"influencer_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_profiles" ADD CONSTRAINT "brand_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencer_profiles" ADD CONSTRAINT "influencer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_influencer_id_influencer_profiles_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "influencer_slug_idx" ON "influencer_profiles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "influencer_city_idx" ON "influencer_profiles" USING btree ("city");--> statement-breakpoint
CREATE INDEX "influencer_featured_idx" ON "influencer_profiles" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");