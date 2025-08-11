export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      OrganizerProfile: {
        Row: {
          companyLogo: string | null;
          companyName: string | null;
          companyType: string | null;
          createdAt: string;
          id: number;
          isActive: boolean;
          isDeleted: boolean;
          updatedAt: string | null;
          user_id: string;
        };
        Insert: {
          companyLogo?: string | null;
          companyName?: string | null;
          companyType?: string | null;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          isDeleted?: boolean;
          updatedAt?: string | null;
          user_id?: string;
        };
        Update: {
          companyLogo?: string | null;
          companyName?: string | null;
          companyType?: string | null;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          isDeleted?: boolean;
          updatedAt?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      Plan: {
        Row: {
          billingCycle: number | null;
          createdAt: string;
          eventLimit: number | null;
          id: number;
          isActive: boolean;
          name: string;
          price: number | null;
          type: string;
          updatedAt: string | null;
        };
        Insert: {
          billingCycle?: number | null;
          createdAt?: string;
          eventLimit?: number | null;
          id?: number;
          isActive?: boolean;
          name: string;
          price?: number | null;
          type: string;
          updatedAt?: string | null;
        };
        Update: {
          billingCycle?: number | null;
          createdAt?: string;
          eventLimit?: number | null;
          id?: number;
          isActive?: boolean;
          name?: string;
          price?: number | null;
          type?: string;
          updatedAt?: string | null;
        };
        Relationships: [];
      };
      Subscription: {
        Row: {
          canceledAt: string | null;
          createdAt: string;
          expDate: string | null;
          id: number;
          organizerId: number;
          pausedAt: string | null;
          planId: number;
          renewedAt: string | null;
          status: number;
          trialEndDate: string | null;
          updatedAt: string | null;
        };
        Insert: {
          canceledAt?: string | null;
          createdAt: string;
          expDate?: string | null;
          id?: number;
          organizerId: number;
          pausedAt?: string | null;
          planId: number;
          renewedAt?: string | null;
          status?: number;
          trialEndDate?: string | null;
          updatedAt?: string | null;
        };
        Update: {
          canceledAt?: string | null;
          createdAt?: string;
          expDate?: string | null;
          id?: number;
          organizerId?: number;
          pausedAt?: string | null;
          planId?: number;
          renewedAt?: string | null;
          status?: number;
          trialEndDate?: string | null;
          updatedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Subscription_organizerId_fkey";
            columns: ["organizerId"];
            isOneToOne: false;
            referencedRelation: "OrganizerProfile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Subscription_planId_fkey";
            columns: ["planId"];
            isOneToOne: false;
            referencedRelation: "Plan";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
