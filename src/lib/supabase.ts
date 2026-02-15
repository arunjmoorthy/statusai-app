import { createClient } from '@supabase/supabase-js';

// Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      status_pages: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          subdomain: string;
          custom_domain: string | null;
          logo_url: string | null;
          primary_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          subdomain: string;
          custom_domain?: string | null;
          logo_url?: string | null;
          primary_color?: string;
        };
        Update: {
          name?: string;
          custom_domain?: string | null;
          logo_url?: string | null;
          primary_color?: string;
        };
      };
      components: {
        Row: {
          id: string;
          status_page_id: string;
          name: string;
          description: string | null;
          status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          status_page_id: string;
          name: string;
          description?: string | null;
          status?: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
          display_order?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
          display_order?: number;
        };
      };
      incidents: {
        Row: {
          id: string;
          status_page_id: string;
          title: string;
          status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          severity: 'minor' | 'major' | 'critical';
          created_at: string;
          resolved_at: string | null;
          updated_at: string;
        };
        Insert: {
          status_page_id: string;
          title: string;
          status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          severity?: 'minor' | 'major' | 'critical';
        };
        Update: {
          title?: string;
          status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          severity?: 'minor' | 'major' | 'critical';
          resolved_at?: string | null;
        };
      };
      incident_updates: {
        Row: {
          id: string;
          incident_id: string;
          status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          message: string;
          is_ai_generated: boolean;
          created_at: string;
        };
        Insert: {
          incident_id: string;
          status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          message: string;
          is_ai_generated?: boolean;
        };
        Update: {
          message?: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          status_page_id: string;
          email: string;
          verified: boolean;
          verification_token: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          status_page_id: string;
          email: string;
          verification_token?: string | null;
        };
        Update: {
          verified?: boolean;
          unsubscribed_at?: string | null;
        };
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Server-side client with service role (for API routes)
export const createServerSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
