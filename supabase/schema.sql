-- StatusAI Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status Pages
CREATE TABLE public.status_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Components
CREATE TABLE public.components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status_page_id UUID REFERENCES public.status_pages(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents
CREATE TABLE public.incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status_page_id UUID REFERENCES public.status_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'investigating' CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  severity TEXT DEFAULT 'minor' CHECK (severity IN ('minor', 'major', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incident-Component relationship (many-to-many)
CREATE TABLE public.incident_components (
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  component_id UUID REFERENCES public.components(id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, component_id)
);

-- Incident Updates
CREATE TABLE public.incident_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  message TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers
CREATE TABLE public.subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status_page_id UUID REFERENCES public.status_pages(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  UNIQUE(status_page_id, email)
);

-- Scheduled Maintenance
CREATE TABLE public.scheduled_maintenances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status_page_id UUID REFERENCES public.status_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_maintenances ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Status Pages: Users can manage their own pages, public can view
CREATE POLICY "Users can manage own pages" ON public.status_pages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view status pages" ON public.status_pages FOR SELECT USING (true);

-- Components: Follow status page permissions
CREATE POLICY "Users can manage own components" ON public.components FOR ALL
  USING (EXISTS (SELECT 1 FROM public.status_pages WHERE id = status_page_id AND user_id = auth.uid()));
CREATE POLICY "Public can view components" ON public.components FOR SELECT USING (true);

-- Incidents: Follow status page permissions
CREATE POLICY "Users can manage own incidents" ON public.incidents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.status_pages WHERE id = status_page_id AND user_id = auth.uid()));
CREATE POLICY "Public can view incidents" ON public.incidents FOR SELECT USING (true);

-- Incident Updates: Follow incident permissions
CREATE POLICY "Users can manage own incident updates" ON public.incident_updates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.incidents i
    JOIN public.status_pages sp ON i.status_page_id = sp.id
    WHERE i.id = incident_id AND sp.user_id = auth.uid()
  ));
CREATE POLICY "Public can view incident updates" ON public.incident_updates FOR SELECT USING (true);

-- Subscribers: Page owners can view, anyone can subscribe
CREATE POLICY "Page owners can view subscribers" ON public.subscribers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.status_pages WHERE id = status_page_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Subscribers can unsubscribe" ON public.subscribers FOR UPDATE USING (true);

-- Indexes for performance
CREATE INDEX idx_status_pages_user_id ON public.status_pages(user_id);
CREATE INDEX idx_status_pages_subdomain ON public.status_pages(subdomain);
CREATE INDEX idx_components_status_page_id ON public.components(status_page_id);
CREATE INDEX idx_incidents_status_page_id ON public.incidents(status_page_id);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incident_updates_incident_id ON public.incident_updates(incident_id);
CREATE INDEX idx_subscribers_status_page_id ON public.subscribers(status_page_id);

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_status_pages_updated_at BEFORE UPDATE ON public.status_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
