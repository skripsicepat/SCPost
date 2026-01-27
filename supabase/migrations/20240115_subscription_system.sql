CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  fakultas TEXT,
  jurusan TEXT,
  peminatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 399000,
  status TEXT NOT NULL DEFAULT 'active',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_date ON public.subscriptions(expiry_date);

CREATE TABLE IF NOT EXISTS public.thesis_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  fakultas TEXT,
  jurusan TEXT,
  peminatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id UUID NOT NULL REFERENCES public.thesis_drafts(id) ON DELETE CASCADE,
  chapter_type TEXT NOT NULL,
  content TEXT,
  revision_count INTEGER DEFAULT 5,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapters_thesis_id ON public.chapters(thesis_id);

CREATE TABLE IF NOT EXISTS public.revision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  previous_content TEXT,
  new_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.revision_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  revisions_added INTEGER NOT NULL DEFAULT 5,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status, scheduled_for);

CREATE OR REPLACE FUNCTION calculate_expiry_date(payment_date TIMESTAMPTZ)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN payment_date + INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_subscription_active(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_sub_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_sub_count
  FROM public.subscriptions
  WHERE user_id = user_id_param
    AND status = 'active'
    AND expiry_date > NOW();
  
  RETURN active_sub_count > 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION schedule_expiry_reminder()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_notifications (
    user_id,
    subscription_id,
    notification_type,
    scheduled_for,
    status
  )
  VALUES (
    NEW.user_id,
    NEW.id,
    'subscription_expiry_reminder',
    NEW.expiry_date - INTERVAL '3 days',
    'pending'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_subscription_created
  AFTER INSERT ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION schedule_expiry_reminder();

CREATE OR REPLACE FUNCTION auto_expire_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired',
      updated_at = NOW()
  WHERE status = 'active'
    AND expiry_date <= NOW();
END;
$$ LANGUAGE plpgsql;

ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
