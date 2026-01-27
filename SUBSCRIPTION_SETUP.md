# SkripsiCepat - Subscription & Quota Management Setup

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Run Database Migration

Run the migration file to create all necessary tables and functions:

```sql
-- Run: supabase/migrations/20240115_subscription_system.sql
```

This migration creates:
- `users` table
- `subscriptions` table (with 30-day expiry tracking)
- `thesis_drafts` table
- `chapters` table (with revision count)
- `revision_history` table
- `revision_purchases` table (for top-up tracking)
- `email_notifications` table
- Helper functions for subscription management
- Trigger for automatic expiry reminder scheduling

### 3. Configure Environment Variables

You need to add these environment variables (in addition to existing Supabase vars):

```env
RESEND_API_KEY=your_resend_api_key_here
```

**To get Resend API Key:**
1. Go to https://resend.com
2. Sign up/login
3. Create new API key
4. Add it to your project settings in Tempo

### 4. Deploy Edge Functions

Deploy the email functions:

```bash
# Deploy send-email function
supabase functions deploy send-email

# Deploy send-expiry-reminders function
supabase functions deploy send-expiry-reminders
```

### 5. Setup Cron Job for Email Reminders

Schedule the `send-expiry-reminders` function to run daily:

**Option A: Using Supabase pg_cron**
```sql
SELECT cron.schedule(
  'send-expiry-reminders',
  '0 10 * * *', -- Run at 10 AM every day
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/send-expiry-reminders',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

**Option B: Using External Cron Service**
- Use a service like Cron-job.org or EasyCron
- Set URL: `YOUR_SUPABASE_URL/functions/v1/send-expiry-reminders`
- Add header: `Authorization: Bearer YOUR_SERVICE_KEY`
- Schedule: Daily at 10:00 AM

---

## 🎯 Features Implemented

### 1. ✅ 30-Day Subscription System
- Payment creates subscription with 30-day expiry
- Automatic expiry tracking
- Status updates (active/expired)
- Subscription check on all actions

### 2. ✅ Email Reminder System (H-3)
- Automatic email scheduling on subscription creation
- Trigger sends reminder 3 days before expiry
- Edge function processes pending notifications
- Professional email template included

### 3. ✅ Revision Quota Management (Independent Per Chapter)
- Each chapter (Bab 1-5 & Daftar Pustaka) has **independent** quota of 5 revisions
- Revision on Bab 1 does NOT affect Bab 2's quota
- Dedicated revision panel at the bottom of each chapter output
- Clear "Sisa kuota revisi: X/5" indicator per chapter
- Revision history stored in database for consistency
- AI instructed to maintain references and cross-chapter consistency

### 4. ✅ Top-Up Payment Flow
- Modal appears when revision quota = 0
- Rp 99,000 for +5 revisions
- Integrated with Midtrans
- Instant activation after payment

### 5. ✅ Updated Terms & Conditions
- 30-day access period
- Renewal requirements
- Top-up policy
- All info clearly stated

### 6. ✅ Database Integration
- Complete schema with relationships
- Foreign key constraints
- Indexes for performance
- Realtime subscription tracking

---

## 🔄 User Flow

### New User Journey
1. User pays Rp 399,000
2. Subscription created (30 days from payment)
3. Email reminder scheduled for day 27
4. User gets full access to all features

### Using Revisions (Independent Per Chapter)
1. Each chapter has its own independent quota of 5 revisions
2. Counter shows: "Sisa kuota revisi: 5/5" at the bottom of each chapter
3. Revision panel with textarea is ALWAYS visible below chapter content
4. Each revision decrements only that specific chapter's counter
5. At 0, "Revisi Sekarang" button is disabled
6. "Beli Tambahan Revisi" button appears for top-up
7. AI maintains existing references and cross-chapter consistency

### Subscription Expiry
1. Day 27: User receives email reminder
2. Day 30: Subscription expires
3. Features locked (cannot start chapters or revise)
4. Orange warning banner shown
5. User must pay Rp 399,000 to renew

### Top-Up Flow
1. User clicks "Revisi Sekarang" with 0 quota for a chapter
2. Button is disabled; "Beli Tambahan Revisi" appears
3. Modal shows: "Kuota Revisi Habis" for that specific chapter
4. Displays: Rp 99,000 for +5 revisions (for that chapter only)
5. User clicks "Beli Paket Revisi"
6. Redirects to Midtrans payment
7. After payment: only that chapter's quota is updated to +5

### Revision Instructions for AI
When revision is triggered:
- **Bab 1-5**: AI rewrites with user feedback, maintaining:
  - Existing scientific references
  - Consistency with other completed chapters
  - Minimum 2000 words quality standard
- **Daftar Pustaka**: AI only:
  - Fixes format (APA style)
  - Adds missing references from Bab 1-5
  - Does NOT remove existing valid references

---

## 🔌 Integration Points

### In `App.tsx` or main component:

```typescript
import { subscriptionService, revisionService } from '@/lib/services';
import { ChapterWorkspace } from '@/components/chapter-workspace';

// Check subscription on mount
useEffect(() => {
  const checkSubscription = async () => {
    if (userId) {
      const sub = await subscriptionService.checkSubscriptionStatus(userId);
      setSubscription(sub);
    }
  };
  checkSubscription();
}, [userId]);

// Handle revision purchase
const handlePurchaseRevisions = async (chapter: Chapter) => {
  // 1. Trigger Midtrans payment for Rp 99,000
  // 2. On success, call:
  const chapterId = chapters[chapter].chapterId;
  await revisionService.purchaseRevisions(userId, chapterId, transactionId);
  // 3. Update local state
};

// Handle subscription renewal
const handleRenewSubscription = async () => {
  // 1. Trigger Midtrans payment for Rp 399,000
  // 2. On success, call:
  const newSub = await subscriptionService.renewSubscription(userId, transactionId);
  setSubscription(newSub);
};

// Pass to ChapterWorkspace
<ChapterWorkspace
  {...otherProps}
  subscription={subscription}
  onRenewSubscription={handleRenewSubscription}
  onPurchaseRevisions={handlePurchaseRevisions}
/>
```

### Payment Integration Notes:
- Use existing Midtrans implementation
- Two transaction types: subscription (399k) and revision (99k)
- Store transaction IDs in database
- Update subscription/revision counts after payment success

---

## 📧 Email Template

The email includes:
- ⚠️ Warning header
- Expiry date (formatted in Indonesian)
- Renewal CTA button
- Professional styling with brand colors
- Auto-sent 3 days before expiry

---

## 🗃️ Database Schema Overview

```
users
├── id (PK)
├── email
├── fakultas
├── jurusan
└── peminatan

subscriptions
├── id (PK)
├── user_id (FK → users)
├── payment_date
├── expiry_date (payment_date + 30 days)
├── amount
├── status (active/expired)
└── transaction_id

thesis_drafts
├── id (PK)
├── user_id (FK → users)
├── subscription_id (FK → subscriptions)
└── title

chapters
├── id (PK)
├── thesis_id (FK → thesis_drafts)
├── chapter_type
├── content
├── revision_count (default: 5)
└── is_complete

revision_purchases
├── id (PK)
├── user_id (FK → users)
├── chapter_id (FK → chapters)
├── amount
├── revisions_added
└── transaction_id

email_notifications
├── id (PK)
├── user_id (FK → users)
├── subscription_id (FK → subscriptions)
├── notification_type
├── scheduled_for (expiry_date - 3 days)
└── status (pending/sent)
```

---

## ✅ Testing Checklist

- [ ] Run migration successfully
- [ ] Create test subscription
- [ ] Verify expiry_date is 30 days from payment_date
- [ ] Check email notification scheduled correctly
- [ ] Test revision counter decrements
- [ ] Verify revision quota modal appears at 0
- [ ] Test top-up flow (mock payment)
- [ ] Verify subscription expired warning shows
- [ ] Test feature locking when expired
- [ ] Run email reminder function manually
- [ ] Verify email received (check spam)

---

## 🚨 Important Notes

1. **Resend API Key**: Required for email functionality. Get from https://resend.com
2. **Cron Job**: Must be set up for automatic email reminders
3. **Transaction IDs**: Store all Midtrans transaction IDs for audit trail
4. **Testing**: Use short expiry periods (e.g., 1 hour) for testing
5. **Email Sender**: Update `from` address in send-email function to your verified domain

---

## 🐛 Troubleshooting

**Emails not sending?**
- Check RESEND_API_KEY is set
- Verify Resend domain is verified
- Check email_notifications table for status

**Subscription not expiring?**
- Run `SELECT auto_expire_subscriptions();` manually
- Check expiry_date format

**Revision count not updating?**
- Verify chapter_id is correct
- Check chapters table directly
- Review revision_purchases records

---

## 📞 Support

For issues with:
- Midtrans integration → Midtrans docs
- Resend email → Resend docs  
- Supabase → Supabase docs
- This implementation → Check migration and service files

---

Made with ❤️ for SkripsiCepat
