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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      artist_availability: {
        Row: {
          artist_id: string
          created_at: string
          date: string
          flash_bid_deadline: string | null
          flash_bid_enabled: boolean
          flash_bid_min_price: number | null
          id: string
          is_available: boolean
          notes: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          date: string
          flash_bid_deadline?: string | null
          flash_bid_enabled?: boolean
          flash_bid_min_price?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          date?: string
          flash_bid_deadline?: string | null
          flash_bid_enabled?: boolean
          flash_bid_min_price?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
        }
        Relationships: []
      }
      artist_listings: {
        Row: {
          created_at: string
          genre: string | null
          id: string
          name: string
          upcoming_concerts: number | null
        }
        Insert: {
          created_at?: string
          genre?: string | null
          id?: string
          name: string
          upcoming_concerts?: number | null
        }
        Update: {
          created_at?: string
          genre?: string | null
          id?: string
          name?: string
          upcoming_concerts?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          artist_id: string
          contract_url: string | null
          created_at: string
          event_date: string
          event_time: string | null
          guarantee: number
          id: string
          offer_id: string
          promoter_id: string
          status: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          artist_id: string
          contract_url?: string | null
          created_at?: string
          event_date: string
          event_time?: string | null
          guarantee?: number
          id?: string
          offer_id: string
          promoter_id: string
          status?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          artist_id?: string
          contract_url?: string | null
          created_at?: string
          event_date?: string
          event_time?: string | null
          guarantee?: number
          id?: string
          offer_id?: string
          promoter_id?: string
          status?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_signatures: {
        Row: {
          booking_id: string
          id: string
          signature_data: string
          signature_type: string
          signed_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          id?: string
          signature_data: string
          signature_type?: string
          signed_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          id?: string
          signature_data?: string
          signature_type?: string
          signed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      counter_offers: {
        Row: {
          created_at: string
          door_split: number | null
          event_date: string
          event_time: string | null
          guarantee: number
          id: string
          merch_split: number | null
          message: string | null
          offer_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          door_split?: number | null
          event_date: string
          event_time?: string | null
          guarantee?: number
          id?: string
          merch_split?: number | null
          message?: string | null
          offer_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          door_split?: number | null
          event_date?: string
          event_time?: string | null
          guarantee?: number
          id?: string
          merch_split?: number | null
          message?: string | null
          offer_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "counter_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string
          day_rate: number | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          role: string
          tour_id: string
        }
        Insert: {
          created_at?: string
          day_rate?: number | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          role: string
          tour_id: string
        }
        Update: {
          created_at?: string
          day_rate?: number | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          deal_room_id: string
          description: string | null
          due_date: string | null
          id: string
          sort_order: number
          status: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deal_room_id: string
          description?: string | null
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: string
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deal_room_id?: string
          description?: string | null
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_milestones_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_rooms: {
        Row: {
          booking_id: string
          created_at: string
          id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_rooms_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_bids: {
        Row: {
          amount: number
          artist_id: string
          availability_id: string
          bidder_id: string
          created_at: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          artist_id: string
          availability_id: string
          bidder_id: string
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          amount?: number
          artist_id?: string
          availability_id?: string
          bidder_id?: string
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "flash_bids_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "artist_availability"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          backline: string | null
          commission_amount: number | null
          commission_rate: number
          created_at: string
          door_split: number | null
          event_date: string
          event_time: string | null
          guarantee: number
          hospitality: string | null
          id: string
          merch_split: number | null
          notes: string | null
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          backline?: string | null
          commission_amount?: number | null
          commission_rate?: number
          created_at?: string
          door_split?: number | null
          event_date: string
          event_time?: string | null
          guarantee?: number
          hospitality?: string | null
          id?: string
          merch_split?: number | null
          notes?: string | null
          recipient_id: string
          sender_id: string
          status?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          backline?: string | null
          commission_amount?: number | null
          commission_rate?: number
          created_at?: string
          door_split?: number | null
          event_date?: string
          event_time?: string | null
          guarantee?: number
          hospitality?: string | null
          id?: string
          merch_split?: number | null
          notes?: string | null
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          genre: string | null
          id: string
          instagram: string | null
          is_verified: boolean | null
          onboarding_steps: Json | null
          profile_complete: boolean | null
          rate_max: number | null
          rate_min: number | null
          role: Database["public"]["Enums"]["app_role"] | null
          slug: string | null
          spotify: string | null
          state: string | null
          subscription_plan: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          genre?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          onboarding_steps?: Json | null
          profile_complete?: boolean | null
          rate_max?: number | null
          rate_min?: number | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          spotify?: string | null
          state?: string | null
          subscription_plan?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          genre?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          onboarding_steps?: Json | null
          profile_complete?: boolean | null
          rate_max?: number | null
          rate_min?: number | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          spotify?: string | null
          state?: string | null
          subscription_plan?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      tour_budget_items: {
        Row: {
          actual_cost: number | null
          category: string
          created_at: string
          description: string
          estimated_cost: number
          id: string
          notes: string | null
          tour_id: string
        }
        Insert: {
          actual_cost?: number | null
          category: string
          created_at?: string
          description: string
          estimated_cost?: number
          id?: string
          notes?: string | null
          tour_id: string
        }
        Update: {
          actual_cost?: number | null
          category?: string
          created_at?: string
          description?: string
          estimated_cost?: number
          id?: string
          notes?: string | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_budget_items_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          tour_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          tour_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          tour_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_documents_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_stops: {
        Row: {
          city: string | null
          created_at: string
          date: string
          doors_time: string | null
          guarantee: number | null
          id: string
          load_in_time: string | null
          notes: string | null
          show_time: string | null
          sort_order: number
          sound_check_time: string | null
          state: string | null
          tour_id: string
          venue_name: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          date: string
          doors_time?: string | null
          guarantee?: number | null
          id?: string
          load_in_time?: string | null
          notes?: string | null
          show_time?: string | null
          sort_order?: number
          sound_check_time?: string | null
          state?: string | null
          tour_id: string
          venue_name: string
        }
        Update: {
          city?: string | null
          created_at?: string
          date?: string
          doors_time?: string | null
          guarantee?: number | null
          id?: string
          load_in_time?: string | null
          notes?: string | null
          show_time?: string | null
          sort_order?: number
          sound_check_time?: string | null
          state?: string | null
          tour_id?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_stops_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venue_availability: {
        Row: {
          available_date: string
          created_at: string
          id: string
          notes: string | null
          venue_id: string
        }
        Insert: {
          available_date: string
          created_at?: string
          id?: string
          notes?: string | null
          venue_id: string
        }
        Update: {
          available_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_claims: {
        Row: {
          business_name: string | null
          created_at: string
          id: string
          proof_text: string | null
          reviewed_at: string | null
          status: string
          user_id: string
          venue_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          id?: string
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
          venue_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          id?: string
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_claims_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_listings: {
        Row: {
          address: string | null
          amenities: string[] | null
          capacity: number | null
          city: string | null
          claim_status: string
          claimed_by: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          region: string | null
          state: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Relationships: []
      }
      venue_photos: {
        Row: {
          caption: string | null
          created_at: string
          file_path: string
          id: string
          sort_order: number | null
          uploaded_by: string
          venue_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          file_path: string
          id?: string
          sort_order?: number | null
          uploaded_by: string
          venue_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          file_path?: string
          id?: string
          sort_order?: number | null
          uploaded_by?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_photos_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          display_name: string | null
          genre: string | null
          id: string | null
          instagram: string | null
          is_verified: boolean | null
          role: Database["public"]["Enums"]["app_role"] | null
          slug: string | null
          spotify: string | null
          state: string | null
          subscription_plan: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          display_name?: string | null
          genre?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          spotify?: string | null
          state?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          display_name?: string | null
          genre?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          spotify?: string | null
          state?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "artist" | "promoter" | "venue" | "production" | "photo_video"
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
      app_role: ["artist", "promoter", "venue", "production", "photo_video"],
    },
  },
} as const
