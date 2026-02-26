export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      artworks: {
        Row: {
          auction_end_date: string | null
          created_at: string | null
          description: string | null
          highest_bid: number | null
          id: string
          is_auction: boolean | null
          is_for_sale: boolean | null
          media_type: string
          media_url: string
          metadata: Json | null
          price_credits: number | null
          title: string
          user_id: string
        }
        Insert: {
          auction_end_date?: string | null
          created_at?: string | null
          description?: string | null
          highest_bid?: number | null
          id?: string
          is_auction?: boolean | null
          is_for_sale?: boolean | null
          media_type: string
          media_url: string
          metadata?: Json | null
          price_credits?: number | null
          title: string
          user_id: string
        }
        Update: {
          auction_end_date?: string | null
          created_at?: string | null
          description?: string | null
          highest_bid?: number | null
          id?: string
          is_auction?: boolean | null
          is_for_sale?: boolean | null
          media_type?: string
          media_url?: string
          metadata?: Json | null
          price_credits?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_members: {
        Row: {
          chat_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          avatar_url: string | null
          chat_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          chat_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          chat_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digital_pets: {
        Row: {
          appearance: Json | null
          attributes: Json | null
          created_at: string | null
          experience: number | null
          id: string
          level: number | null
          name: string
          owner_id: string
          species: string
          updated_at: string | null
        }
        Insert: {
          appearance?: Json | null
          attributes?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          name: string
          owner_id: string
          species?: string
          updated_at?: string | null
        }
        Update: {
          appearance?: Json | null
          attributes?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          name?: string
          owner_id?: string
          species?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dreamspaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          resonance_score: number | null
          scene_data: Json | null
          space_type: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          resonance_score?: number | null
          scene_data?: Json | null
          space_type?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          resonance_score?: number | null
          scene_data?: Json | null
          space_type?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      guardian_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          guardian_name: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          severity: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          guardian_name?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          guardian_name?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
          source?: string | null
        }
        Relationships: []
      }
      ip_records: {
        Row: {
          block_number: number | null
          content_hash: string
          content_type: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          msr_transaction_hash: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_number?: number | null
          content_hash: string
          content_type: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          msr_transaction_hash?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_number?: number | null
          content_hash?: string
          content_type?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          msr_transaction_hash?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      live_streams: {
        Row: {
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          is_adult: boolean | null
          is_live: boolean | null
          started_at: string | null
          stream_type: string | null
          stream_url: string | null
          thumbnail_url: string | null
          title: string
          user_id: string
          viewers_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_adult?: boolean | null
          is_live?: boolean | null
          started_at?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title: string
          user_id: string
          viewers_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_adult?: boolean | null
          is_live?: boolean | null
          started_at?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          viewers_count?: number | null
        }
        Relationships: []
      }
      lottery_draws: {
        Row: {
          chainlink_subscription_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          draw_date: string
          id: string
          max_tickets: number
          name: string
          prize_pool: number
          quantum_split_creator: number | null
          quantum_split_infra: number | null
          quantum_split_resilience: number | null
          status: string
          ticket_price: number
          tickets_sold: number
          vrf_proof: string | null
          vrf_random_number: string | null
          vrf_request_id: string | null
          winner_user_id: string | null
        }
        Insert: {
          chainlink_subscription_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          draw_date: string
          id?: string
          max_tickets: number
          name: string
          prize_pool?: number
          quantum_split_creator?: number | null
          quantum_split_infra?: number | null
          quantum_split_resilience?: number | null
          status?: string
          ticket_price: number
          tickets_sold?: number
          vrf_proof?: string | null
          vrf_random_number?: string | null
          vrf_request_id?: string | null
          winner_user_id?: string | null
        }
        Update: {
          chainlink_subscription_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          draw_date?: string
          id?: string
          max_tickets?: number
          name?: string
          prize_pool?: number
          quantum_split_creator?: number | null
          quantum_split_infra?: number | null
          quantum_split_resilience?: number | null
          status?: string
          ticket_price?: number
          tickets_sold?: number
          vrf_proof?: string | null
          vrf_random_number?: string | null
          vrf_request_id?: string | null
          winner_user_id?: string | null
        }
        Relationships: []
      }
      lottery_tickets: {
        Row: {
          created_at: string
          draw_id: string
          id: string
          is_winner: boolean | null
          purchase_transaction_id: string | null
          ticket_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          draw_id: string
          id?: string
          is_winner?: boolean | null
          purchase_transaction_id?: string | null
          ticket_number: number
          user_id: string
        }
        Update: {
          created_at?: string
          draw_id?: string
          id?: string
          is_winner?: boolean | null
          purchase_transaction_id?: string | null
          ticket_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_tickets_draw_id_fkey"
            columns: ["draw_id"]
            isOneToOne: false
            referencedRelation: "lottery_draws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_tickets_purchase_transaction_id_fkey"
            columns: ["purchase_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          media_type: string | null
          media_url: string | null
          metadata: Json | null
          price: number
          seller_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          price: number
          seller_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          price?: number
          seller_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string | null
          expires_at: string | null
          features: Json | null
          id: string
          price_paid: number | null
          started_at: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          features?: Json | null
          id?: string
          price_paid?: number | null
          started_at?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          features?: Json | null
          id?: string
          price_paid?: number | null
          started_at?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_challenges: {
        Row: {
          challenge: string
          challenge_type: string
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          challenge: string
          challenge_type: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          challenge?: string
          challenge_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string
          is_adult: boolean | null
          media_types: string[] | null
          media_urls: string[] | null
          post_type: string | null
          resonance_count: number | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_adult?: boolean | null
          media_types?: string[] | null
          media_urls?: string[] | null
          post_type?: string | null
          resonance_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_adult?: boolean | null
          media_types?: string[] | null
          media_urls?: string[] | null
          post_type?: string | null
          resonance_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          credits_balance: number | null
          full_name: string | null
          id: string
          location: string | null
          resonance_score: number | null
          updated_at: string | null
          username: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits_balance?: number | null
          full_name?: string | null
          id: string
          location?: string | null
          resonance_score?: number | null
          updated_at?: string | null
          username: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits_balance?: number | null
          full_name?: string | null
          id?: string
          location?: string | null
          resonance_score?: number | null
          updated_at?: string | null
          username?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: []
      }
      resonances: {
        Row: {
          created_at: string | null
          emotion: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotion?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotion?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resonances_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          msr_hash: string | null
          resource_id: string | null
          resource_type: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          msr_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          msr_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_credentials: {
        Row: {
          counter: number | null
          created_at: string
          credential_id: string
          credential_type: string
          device_name: string | null
          id: string
          is_primary: boolean | null
          last_used_at: string | null
          public_key: string | null
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number | null
          created_at?: string
          credential_id: string
          credential_type: string
          device_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_used_at?: string | null
          public_key?: string | null
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number | null
          created_at?: string
          credential_id?: string
          credential_type?: string
          device_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_used_at?: string | null
          public_key?: string | null
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_accounts: {
        Row: {
          balance_mxn: number
          balance_tamv: number
          balance_usd: number
          created_at: string
          daily_limit: number
          freeze_reason: string | null
          frozen_balance: number
          id: string
          is_frozen: boolean | null
          is_verified: boolean | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          balance_mxn?: number
          balance_tamv?: number
          balance_usd?: number
          created_at?: string
          daily_limit?: number
          freeze_reason?: string | null
          frozen_balance?: number
          id?: string
          is_frozen?: boolean | null
          is_verified?: boolean | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          balance_mxn?: number
          balance_tamv?: number
          balance_usd?: number
          created_at?: string
          daily_limit?: number
          freeze_reason?: string | null
          frozen_balance?: number
          id?: string
          is_frozen?: boolean | null
          is_verified?: boolean | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          counterparty: string | null
          counterparty_user_id: string | null
          created_at: string
          currency: string
          fee_amount: number | null
          id: string
          metadata: Json | null
          msr_hash: string | null
          status: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          counterparty?: string | null
          counterparty_user_id?: string | null
          created_at?: string
          currency: string
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          msr_hash?: string | null
          status?: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          counterparty?: string | null
          counterparty_user_id?: string | null
          created_at?: string
          currency?: string
          fee_amount?: number | null
          id?: string
          metadata?: Json | null
          msr_hash?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type?: string
          p_severity?: string
          p_user_id: string
        }
        Returns: string
      }
      purchase_lottery_ticket: {
        Args: { p_draw_id: string; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "verified" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "verified", "user"],
    },
  },
} as const
