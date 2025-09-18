export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Business: {
        Row: {
          codeId: string;
          createdAt: string;
          description: string;
          id: number;
          isActive: boolean;
          isDeleted: boolean;
          name: string | null;
          organizerId: number;
          slug: string | null;
        };
        Insert: {
          codeId?: string;
          createdAt?: string;
          description: string;
          id?: number;
          isActive: boolean;
          isDeleted?: boolean;
          name?: string | null;
          organizerId: number;
          slug?: string | null;
        };
        Update: {
          codeId?: string;
          createdAt?: string;
          description?: string;
          id?: number;
          isActive?: boolean;
          isDeleted?: boolean;
          name?: string | null;
          organizerId?: number;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Business_organizerId_fkey";
            columns: ["organizerId"];
            isOneToOne: false;
            referencedRelation: "OrganizerProfile";
            referencedColumns: ["id"];
          }
        ];
      };
      CustomEventConfig: {
        Row: {
          accessType: Database["public"]["Enums"]["custom_event_access_type"];
          businessId: number;
          createdAt: string;
          id: number;
          isForMinors: boolean;
          isPublic: boolean;
          name: string;
          selectedLanguages: string[] | null;
          spaceType: Database["public"]["Enums"]["custom_event_space_type"];
          subType: Database["public"]["Enums"]["custom_event_subtype"] | null;
          type: Database["public"]["Enums"]["custom_event_type"];
        };
        Insert: {
          accessType: Database["public"]["Enums"]["custom_event_access_type"];
          businessId: number;
          createdAt?: string;
          id?: number;
          isForMinors: boolean;
          isPublic: boolean;
          name: string;
          selectedLanguages?: string[] | null;
          spaceType: Database["public"]["Enums"]["custom_event_space_type"];
          subType?: Database["public"]["Enums"]["custom_event_subtype"] | null;
          type: Database["public"]["Enums"]["custom_event_type"];
        };
        Update: {
          accessType?: Database["public"]["Enums"]["custom_event_access_type"];
          businessId?: number;
          createdAt?: string;
          id?: number;
          isForMinors?: boolean;
          isPublic?: boolean;
          name?: string;
          selectedLanguages?: string[] | null;
          spaceType?: Database["public"]["Enums"]["custom_event_space_type"];
          subType?: Database["public"]["Enums"]["custom_event_subtype"] | null;
          type?: Database["public"]["Enums"]["custom_event_type"];
        };
        Relationships: [
          {
            foreignKeyName: "CustomEventConfig_businessId_fkey";
            columns: ["businessId"];
            isOneToOne: false;
            referencedRelation: "Business";
            referencedColumns: ["id"];
          }
        ];
      };
      Event: {
        Row: {
          accessType: string | null;
          businessId: number | null;
          createdAt: string;
          defaultLocale: string | null;
          endDate: string;
          id: number;
          isActive: boolean | null;
          isDeleted: boolean;
          isForMinors: boolean | null;
          isPublished: boolean | null;
          isPublic: boolean | null;
          keywords: string[] | null;
          slug: string;
          spaceType: string | null;
          startDate: string;
          step: number;
          subType: string;
          type: string;
          visitsLimit: number | null;
        };
        Insert: {
          accessType?: string | null;
          businessId?: number | null;
          createdAt?: string;
          defaultLocale?: string | null;
          endDate: string;
          id?: number;
          isActive?: boolean | null;
          isDeleted?: boolean;
          isForMinors?: boolean | null;
          isPublished?: boolean | null;
          isPublic?: boolean | null;
          keywords?: string[] | null;
          slug?: string;
          spaceType?: string | null;
          startDate: string;
          step?: number;
          subType: string;
          type: string;
          visitsLimit?: number | null;
        };
        Update: {
          accessType?: string | null;
          businessId?: number | null;
          createdAt?: string;
          defaultLocale?: string | null;
          endDate?: string;
          id?: number;
          isActive?: boolean | null;
          isDeleted?: boolean;
          isForMinors?: boolean | null;
          isPublished?: boolean | null;
          isPublic?: boolean | null;
          keywords?: string[] | null;
          slug?: string;
          spaceType?: string | null;
          startDate?: string;
          step?: number;
          subType?: string;
          type?: string;
          visitsLimit?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Event_businessId_fkey";
            columns: ["businessId"];
            isOneToOne: false;
            referencedRelation: "Business";
            referencedColumns: ["id"];
          }
        ];
      };
      EventImage: {
        Row: {
          created_at: string;
          eventId: number | null;
          id: number;
          size: number | null;
          type: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          eventId?: number | null;
          id?: number;
          size?: number | null;
          type: string;
          url: string;
        };
        Update: {
          created_at?: string;
          eventId?: number | null;
          id?: number;
          size?: number | null;
          type?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventImage_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          }
        ];
      };
      EventText: {
        Row: {
          createdAt: string;
          description: string;
          eventId: number;
          id: number;
          languageId: number;
          locationText: string | null;
          tiptapText: Json | null;
          title: string;
        };
        Insert: {
          createdAt?: string;
          description: string;
          eventId: number;
          id?: number;
          languageId: number;
          locationText?: string | null;
          tiptapText?: Json | null;
          title: string;
        };
        Update: {
          createdAt?: string;
          description?: string;
          eventId?: number;
          id?: number;
          languageId?: number;
          locationText?: string | null;
          tiptapText?: Json | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "EventText_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "EventText_languageId_fkey";
            columns: ["languageId"];
            isOneToOne: false;
            referencedRelation: "Language";
            referencedColumns: ["id"];
          }
        ];
      };
      Language: {
        Row: {
          code: string;
          createdAt: string;
          icon: string | null;
          id: number;
          name: string;
          native: string;
        };
        Insert: {
          code: string;
          createdAt?: string;
          icon?: string | null;
          id?: number;
          name: string;
          native: string;
        };
        Update: {
          code?: string;
          createdAt?: string;
          icon?: string | null;
          id?: number;
          name?: string;
          native?: string;
        };
        Relationships: [];
      };
      OrganizerProfile: {
        Row: {
          codeId: string;
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
          codeId?: string;
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
          codeId?: string;
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
      SubType: {
        Row: {
          createdAt: string;
          icon: string | null;
          id: number;
          labelEn: string | null;
          labelEs: string | null;
          name: string | null;
          typeId: number | null;
        };
        Insert: {
          createdAt?: string;
          icon?: string | null;
          id?: number;
          labelEn?: string | null;
          labelEs?: string | null;
          name?: string | null;
          typeId?: number | null;
        };
        Update: {
          createdAt?: string;
          icon?: string | null;
          id?: number;
          labelEn?: string | null;
          labelEs?: string | null;
          name?: string | null;
          typeId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "SubType_typeId_fkey";
            columns: ["typeId"];
            isOneToOne: false;
            referencedRelation: "Types";
            referencedColumns: ["id"];
          }
        ];
      };
      Types: {
        Row: {
          createdAt: string;
          icon: string | null;
          id: number;
          labelEn: string | null;
          labelEs: string | null;
          name: string;
        };
        Insert: {
          createdAt?: string;
          icon?: string | null;
          id?: number;
          labelEn?: string | null;
          labelEs?: string | null;
          name: string;
        };
        Update: {
          createdAt?: string;
          icon?: string | null;
          id?: number;
          labelEn?: string | null;
          labelEs?: string | null;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      custom_event_access_type: "confirmations" | "tickets" | "ticketsAndSpaces" | "seat";
      custom_event_space_type: "indoor" | "outdoors" | "semiCovered" | "airConditioned" | "mixed" | "mixed2";
      custom_event_subtype:
        | "nightClub"
        | "comedyShow"
        | "theater"
        | "cinema"
        | "dance"
        | "literature"
        | "gallery"
        | "food"
        | "spiritsTasting"
        | "marathon"
        | "fitness"
        | "conference"
        | "workshop"
        | "bachelorParty"
        | "wedding"
        | "birthday"
        | "babyShower"
        | "genderReveal"
        | "fashion"
        | "cityTour"
        | "natureExcursion"
        | "camping"
        | "beach"
        | "concert"
        | "skating"
        | "networking"
        | "childrensParty";
      custom_event_type: "party" | "art" | "food" | "sport" | "educational" | "familiar" | "excursion";
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      custom_event_access_type: ["confirmations", "tickets", "ticketsAndSpaces", "seat"],
      custom_event_space_type: ["indoor", "outdoors", "semiCovered", "airConditioned", "mixed", "mixed2"],
      custom_event_subtype: [
        "nightClub",
        "comedyShow",
        "theater",
        "cinema",
        "dance",
        "literature",
        "gallery",
        "food",
        "spiritsTasting",
        "marathon",
        "fitness",
        "conference",
        "workshop",
        "bachelorParty",
        "wedding",
        "birthday",
        "babyShower",
        "genderReveal",
        "fashion",
        "cityTour",
        "natureExcursion",
        "camping",
        "beach",
        "concert",
        "skating",
        "networking",
        "childrensParty",
      ],
      custom_event_type: ["party", "art", "food", "sport", "educational", "familiar", "excursion"],
    },
  },
} as const;
