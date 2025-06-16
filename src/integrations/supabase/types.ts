export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      hr_experts: {
        Row: {
          chat_id: string
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          message: string
          phone: string | null
          subscribed: boolean | null
          telegram_username: string
          updated_at: string | null
          user_id: number
          user_type: number
        }
        Insert: {
          chat_id: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          message: string
          phone?: string | null
          subscribed?: boolean | null
          telegram_username: string
          updated_at?: string | null
          user_id: number
          user_type?: number
        }
        Update: {
          chat_id?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string
          phone?: string | null
          subscribed?: boolean | null
          telegram_username?: string
          updated_at?: string | null
          user_id?: number
          user_type?: number
        }
        Relationships: []
      }
      job_seekers: {
        Row: {
          created_at: string
          desired_position: string | null
          desired_salary: number | null
          email: string
          experience_years: number | null
          full_name: string
          github_url: string | null
          id: string
          location: string | null
          phone: string | null
          resume_file_url: string | null
          skills: string[] | null
          telegram_username: string | null
          updated_at: string
          work_format: string | null
        }
        Insert: {
          created_at?: string
          desired_position?: string | null
          desired_salary?: number | null
          email: string
          experience_years?: number | null
          full_name: string
          github_url?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          resume_file_url?: string | null
          skills?: string[] | null
          telegram_username?: string | null
          updated_at?: string
          work_format?: string | null
        }
        Update: {
          created_at?: string
          desired_position?: string | null
          desired_salary?: number | null
          email?: string
          experience_years?: number | null
          full_name?: string
          github_url?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          resume_file_url?: string | null
          skills?: string[] | null
          telegram_username?: string | null
          updated_at?: string
          work_format?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          created_at: string
          generated_keywords: string[] | null
          hr_expert_id: string | null
          id: string
          location: string | null
          message: Json
          salary: number | null
          session_id: string
          user_id: string | null
          work_format: string | null
        }
        Insert: {
          created_at?: string
          generated_keywords?: string[] | null
          hr_expert_id?: string | null
          id?: string
          location?: string | null
          message: Json
          salary?: number | null
          session_id: string
          user_id?: string | null
          work_format?: string | null
        }
        Update: {
          created_at?: string
          generated_keywords?: string[] | null
          hr_expert_id?: string | null
          id?: string
          location?: string | null
          message?: Json
          salary?: number | null
          session_id?: string
          user_id?: string | null
          work_format?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_hr_expert_id_fkey"
            columns: ["hr_expert_id"]
            isOneToOne: false
            referencedRelation: "hr_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_channels: {
        Row: {
          activity_score: number | null
          admin_contact: string | null
          channel_description: string | null
          channel_title: string
          channel_username: string
          created_at: string
          discovered_date: string | null
          id: string
          is_active: boolean | null
          is_free: boolean | null
          languages: string[] | null
          last_checked_date: string | null
          members_count: number | null
          posting_price: number | null
          posting_rules: string | null
          relevance_score: number | null
          success_rate: number | null
          tags: string[] | null
          updated_at: string
          work_formats: string[] | null
        }
        Insert: {
          activity_score?: number | null
          admin_contact?: string | null
          channel_description?: string | null
          channel_title: string
          channel_username: string
          created_at?: string
          discovered_date?: string | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          languages?: string[] | null
          last_checked_date?: string | null
          members_count?: number | null
          posting_price?: number | null
          posting_rules?: string | null
          relevance_score?: number | null
          success_rate?: number | null
          tags?: string[] | null
          updated_at?: string
          work_formats?: string[] | null
        }
        Update: {
          activity_score?: number | null
          admin_contact?: string | null
          channel_description?: string | null
          channel_title?: string
          channel_username?: string
          created_at?: string
          discovered_date?: string | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          languages?: string[] | null
          last_checked_date?: string | null
          members_count?: number | null
          posting_price?: number | null
          posting_rules?: string | null
          relevance_score?: number | null
          success_rate?: number | null
          tags?: string[] | null
          updated_at?: string
          work_formats?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
