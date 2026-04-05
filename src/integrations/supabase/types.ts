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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      game_uploaded_images: {
        Row: {
          created_at: string
          game_key: string
          id: string
          image_data: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_key: string
          id?: string
          image_data: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_key?: string
          id?: string
          image_data?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completion_percent: number | null
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          engagement_level: string | null
          game_key: string
          gaze_reminders: number | null
          id: string
          language: string | null
          module_key: string
          score_percent: number | null
          select_tries: number | null
          source_app: string
          star_count: number | null
          started_at: string
          status: string
          total_tries: number | null
          updated_at: string
          user_id: string
          voice_tries: number | null
        }
        Insert: {
          completion_percent?: number | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          engagement_level?: string | null
          game_key: string
          gaze_reminders?: number | null
          id?: string
          language?: string | null
          module_key: string
          score_percent?: number | null
          select_tries?: number | null
          source_app: string
          star_count?: number | null
          started_at: string
          status?: string
          total_tries?: number | null
          updated_at?: string
          user_id: string
          voice_tries?: number | null
        }
        Update: {
          completion_percent?: number | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          engagement_level?: string | null
          game_key?: string
          gaze_reminders?: number | null
          id?: string
          language?: string | null
          module_key?: string
          score_percent?: number | null
          select_tries?: number | null
          source_app?: string
          star_count?: number | null
          started_at?: string
          status?: string
          total_tries?: number | null
          updated_at?: string
          user_id?: string
          voice_tries?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          child_age: number | null
          child_name: string | null
          created_at: string
          display_name: string | null
          favorite_character: string | null
          id: string
          language: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          child_age?: number | null
          child_name?: string | null
          created_at?: string
          display_name?: string | null
          favorite_character?: string | null
          id?: string
          language?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          child_age?: number | null
          child_name?: string | null
          created_at?: string
          display_name?: string | null
          favorite_character?: string | null
          id?: string
          language?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      session_emotion_metrics: {
        Row: {
          created_at: string
          emotion: string
          id: string
          sample_count: number
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion: string
          id?: string
          sample_count?: number
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotion?: string
          id?: string
          sample_count?: number
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_focus_metrics: {
        Row: {
          created_at: string
          distracted_time_ms: number
          distraction_count: number
          focus_ratio: number
          focus_time_ms: number
          id: string
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distracted_time_ms?: number
          distraction_count?: number
          focus_ratio?: number
          focus_time_ms?: number
          id?: string
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          distracted_time_ms?: number
          distraction_count?: number
          focus_ratio?: number
          focus_time_ms?: number
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
