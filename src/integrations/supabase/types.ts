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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      border_options: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          sort: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          sort?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      border_prices: {
        Row: {
          price: number
          size_id: string
          updated_at: string
        }
        Insert: {
          price?: number
          size_id: string
          updated_at?: string
        }
        Update: {
          price?: number
          size_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      combos: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          image_key: string
          name: string
          old_price: number | null
          price: number | null
          sort: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_key?: string
          name: string
          old_price?: number | null
          price?: number | null
          sort?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_key?: string
          name?: string
          old_price?: number | null
          price?: number | null
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_settings: {
        Row: {
          base_fee: number
          id: boolean
          max_km: number
          mode: string
          per_km: number
          updated_at: string
        }
        Insert: {
          base_fee?: number
          id?: boolean
          max_km?: number
          mode?: string
          per_km?: number
          updated_at?: string
        }
        Update: {
          base_fee?: number
          id?: boolean
          max_km?: number
          mode?: string
          per_km?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_tiers: {
        Row: {
          created_at: string
          fee: number
          id: string
          up_to_km: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee: number
          id?: string
          up_to_km: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          up_to_km?: number
          updated_at?: string
        }
        Relationships: []
      }
      drinks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_key: string
          name: string
          price: number
          sort: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_key?: string
          name: string
          price?: number
          sort?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_key?: string
          name?: string
          price?: number
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_flavors: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          list: string
          name: string
          sort: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          list: string
          name: string
          sort?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          list?: string
          name?: string
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_sizes: {
        Row: {
          category_id: string
          category_label: string
          category_tagline: string
          created_at: string
          id: string
          label: string
          max_flavors: number
          price: number
          size_id: string
          slices: string
          sort: number
          updated_at: string
        }
        Insert: {
          category_id: string
          category_label: string
          category_tagline?: string
          created_at?: string
          id?: string
          label: string
          max_flavors?: number
          price?: number
          size_id: string
          slices?: string
          sort?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          category_label?: string
          category_tagline?: string
          created_at?: string
          id?: string
          label?: string
          max_flavors?: number
          price?: number
          size_id?: string
          slices?: string
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      promo_prices: {
        Row: {
          flavor_count: number
          price: number
          updated_at: string
        }
        Insert: {
          flavor_count: number
          price: number
          updated_at?: string
        }
        Update: {
          flavor_count?: number
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
