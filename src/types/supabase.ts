import { SupabaseClient } from "@supabase/supabase-js";

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
      AccessType: {
        Row: {
          createdAt: string;
          id: number;
          isActive: boolean;
          labelEn: string;
          labelEs: string;
          name: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          labelEn: string;
          labelEs: string;
          name: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          labelEn?: string;
          labelEs?: string;
          name?: string;
        };
        Relationships: [];
      };
      Asset: {
        Row: {
          code: string;
          createdAt: string;
          id: number;
          isActive: boolean;
          name: string;
          symbol: string;
          type: Database["public"]["Enums"]["ENUM(AssetTypes)"];
        };
        Insert: {
          code: string;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          name: string;
          symbol: string;
          type: Database["public"]["Enums"]["ENUM(AssetTypes)"];
        };
        Update: {
          code?: string;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          name?: string;
          symbol?: string;
          type?: Database["public"]["Enums"]["ENUM(AssetTypes)"];
        };
        Relationships: [];
      };
      Business: {
        Row: {
          codeId: string;
          createdAt: string;
          description: string;
          id: number;
          isActive: boolean;
          isDeleted: boolean;
          logo: string | null;
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
          logo?: string | null;
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
          logo?: string | null;
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
      ClientCompanion: {
        Row: {
          clientId: number;
          createdAt: string;
          id: number;
          visitId: number | null;
        };
        Insert: {
          clientId: number;
          createdAt?: string;
          id?: number;
          visitId?: number | null;
        };
        Update: {
          clientId?: number;
          createdAt?: string;
          id?: number;
          visitId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ClientCompanion_clientId_fkey";
            columns: ["clientId"];
            isOneToOne: false;
            referencedRelation: "ClientProfile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ClientCompanion_visitId_fkey";
            columns: ["visitId"];
            isOneToOne: false;
            referencedRelation: "Visit";
            referencedColumns: ["id"];
          }
        ];
      };
      clientOnBusiness: {
        Row: {
          badge: string;
          businessId: number;
          clientId: number;
          createdAt: string;
          id: number;
        };
        Insert: {
          badge?: string;
          businessId: number;
          clientId: number;
          createdAt?: string;
          id?: number;
        };
        Update: {
          badge?: string;
          businessId?: number;
          clientId?: number;
          createdAt?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "clientOnBusiness_businessId_fkey";
            columns: ["businessId"];
            isOneToOne: false;
            referencedRelation: "Business";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clientOnBusiness_clientId_fkey";
            columns: ["clientId"];
            isOneToOne: false;
            referencedRelation: "ClientProfile";
            referencedColumns: ["id"];
          }
        ];
      };
      ClientProfile: {
        Row: {
          avatar: string | null;
          birthday: string | null;
          createdAt: string;
          email: string | null;
          id: number;
          info: string | null;
          name: string | null;
          phone: string | null;
          sex: string | null;
          updatedAt: string;
          user_id: string;
          username: string;
        };
        Insert: {
          avatar?: string | null;
          birthday?: string | null;
          createdAt?: string;
          email?: string | null;
          id?: number;
          info?: string | null;
          name?: string | null;
          phone?: string | null;
          sex?: string | null;
          updatedAt?: string;
          user_id: string;
          username: string;
        };
        Update: {
          avatar?: string | null;
          birthday?: string | null;
          createdAt?: string;
          email?: string | null;
          id?: number;
          info?: string | null;
          name?: string | null;
          phone?: string | null;
          sex?: string | null;
          updatedAt?: string;
          user_id?: string;
          username?: string;
        };
        Relationships: [];
      };
      clientVisitAffiliated: {
        Row: {
          clientId: number;
          createdAt: string;
          id: number;
          visitId: number;
        };
        Insert: {
          clientId: number;
          createdAt?: string;
          id?: number;
          visitId: number;
        };
        Update: {
          clientId?: number;
          createdAt?: string;
          id?: number;
          visitId?: number;
        };
        Relationships: [
          {
            foreignKeyName: "clientVisitAffiliated_clientId_fkey";
            columns: ["clientId"];
            isOneToOne: false;
            referencedRelation: "ClientProfile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clientVisitAffiliated_visitId_fkey";
            columns: ["visitId"];
            isOneToOne: true;
            referencedRelation: "Visit";
            referencedColumns: ["id"];
          }
        ];
      };
      CustomEventConfig: {
        Row: {
          accessTypeId: number | null;
          businessId: number;
          createdAt: string;
          id: number;
          isForMinors: boolean;
          isPublic: boolean;
          name: string;
          selectedLanguages: string[] | null;
          spaceTypeId: number | null;
          subTypeId: number | null;
          typeId: number | null;
        };
        Insert: {
          accessTypeId?: number | null;
          businessId: number;
          createdAt?: string;
          id?: number;
          isForMinors: boolean;
          isPublic: boolean;
          name: string;
          selectedLanguages?: string[] | null;
          spaceTypeId?: number | null;
          subTypeId?: number | null;
          typeId?: number | null;
        };
        Update: {
          accessTypeId?: number | null;
          businessId?: number;
          createdAt?: string;
          id?: number;
          isForMinors?: boolean;
          isPublic?: boolean;
          name?: string;
          selectedLanguages?: string[] | null;
          spaceTypeId?: number | null;
          subTypeId?: number | null;
          typeId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "CustomEventConfig_accessTypeId_fkey";
            columns: ["accessTypeId"];
            isOneToOne: false;
            referencedRelation: "AccessType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CustomEventConfig_businessId_fkey";
            columns: ["businessId"];
            isOneToOne: false;
            referencedRelation: "Business";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CustomEventConfig_spaceTypeId_fkey";
            columns: ["spaceTypeId"];
            isOneToOne: false;
            referencedRelation: "SpaceType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CustomEventConfig_subTypeId_fkey";
            columns: ["subTypeId"];
            isOneToOne: false;
            referencedRelation: "SubType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CustomEventConfig_typeId_fkey";
            columns: ["typeId"];
            isOneToOne: false;
            referencedRelation: "Type";
            referencedColumns: ["id"];
          }
        ];
      };
      Event: {
        Row: {
          accessTypeId: number | null;
          businessId: number | null;
          createdAt: string;
          defaultLocale: string | null;
          endDate: string;
          id: number;
          isDeleted: boolean;
          isForMinors: boolean | null;
          isFull: boolean;
          isPublic: boolean | null;
          isPublished: boolean | null;
          keywords: string[] | null;
          lat: number | null;
          lng: number | null;
          slug: string;
          spaceTypeId: number | null;
          startDate: string;
          step: number;
          subTypeId: number | null;
          timeZoneId: string | null;
          timeZoneName: string | null;
          typeId: number;
          visitsLimit: number | null;
        };
        Insert: {
          accessTypeId?: number | null;
          businessId?: number | null;
          createdAt?: string;
          defaultLocale?: string | null;
          endDate: string;
          id?: number;
          isDeleted?: boolean;
          isForMinors?: boolean | null;
          isFull?: boolean;
          isPublic?: boolean | null;
          isPublished?: boolean | null;
          keywords?: string[] | null;
          lat?: number | null;
          lng?: number | null;
          slug?: string;
          spaceTypeId?: number | null;
          startDate: string;
          step?: number;
          subTypeId?: number | null;
          timeZoneId?: string | null;
          timeZoneName?: string | null;
          typeId: number;
          visitsLimit?: number | null;
        };
        Update: {
          accessTypeId?: number | null;
          businessId?: number | null;
          createdAt?: string;
          defaultLocale?: string | null;
          endDate?: string;
          id?: number;
          isDeleted?: boolean;
          isForMinors?: boolean | null;
          isFull?: boolean;
          isPublic?: boolean | null;
          isPublished?: boolean | null;
          keywords?: string[] | null;
          lat?: number | null;
          lng?: number | null;
          slug?: string;
          spaceTypeId?: number | null;
          startDate?: string;
          step?: number;
          subTypeId?: number | null;
          timeZoneId?: string | null;
          timeZoneName?: string | null;
          typeId?: number;
          visitsLimit?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Event_accessTypeId_fkey";
            columns: ["accessTypeId"];
            isOneToOne: false;
            referencedRelation: "AccessType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Event_businessId_fkey";
            columns: ["businessId"];
            isOneToOne: false;
            referencedRelation: "Business";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Event_spaceTypeId_fkey";
            columns: ["spaceTypeId"];
            isOneToOne: false;
            referencedRelation: "SpaceType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Event_subTypeId_fkey";
            columns: ["subTypeId"];
            isOneToOne: false;
            referencedRelation: "SubType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Event_typeId_fkey";
            columns: ["typeId"];
            isOneToOne: false;
            referencedRelation: "Type";
            referencedColumns: ["id"];
          }
        ];
      };
      EventImage: {
        Row: {
          createdAt: string;
          eventId: number | null;
          id: number;
          size: number | null;
          type: string;
          url: string;
        };
        Insert: {
          createdAt?: string;
          eventId?: number | null;
          id?: number;
          size?: number | null;
          type: string;
          url: string;
        };
        Update: {
          createdAt?: string;
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
          title: string;
        };
        Insert: {
          createdAt?: string;
          description: string;
          eventId: number;
          id?: number;
          languageId: number;
          locationText?: string | null;
          title: string;
        };
        Update: {
          createdAt?: string;
          description?: string;
          eventId?: number;
          id?: number;
          languageId?: number;
          locationText?: string | null;
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
          id: number;
          isActive: boolean;
          name: string;
          type: string;
          updatedAt: string | null;
        };
        Insert: {
          billingCycle?: number | null;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          name: string;
          type: string;
          updatedAt?: string | null;
        };
        Update: {
          billingCycle?: number | null;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          name?: string;
          type?: string;
          updatedAt?: string | null;
        };
        Relationships: [];
      };
      PlanPrice: {
        Row: {
          amount: number;
          assetId: number;
          createdAt: string;
          id: number;
          isActive: boolean;
          planId: number;
        };
        Insert: {
          amount: number;
          assetId: number;
          createdAt?: string;
          id?: number;
          isActive: boolean;
          planId: number;
        };
        Update: {
          amount?: number;
          assetId?: number;
          createdAt?: string;
          id?: number;
          isActive?: boolean;
          planId?: number;
        };
        Relationships: [
          {
            foreignKeyName: "PlanPrice_assetId_fkey";
            columns: ["assetId"];
            isOneToOne: false;
            referencedRelation: "Asset";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "PlanPrice_planId_fkey";
            columns: ["planId"];
            isOneToOne: false;
            referencedRelation: "Plan";
            referencedColumns: ["id"];
          }
        ];
      };
      SpaceType: {
        Row: {
          createdAt: string;
          id: number;
          labelEn: string;
          labelEs: string;
          name: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          labelEn: string;
          labelEs: string;
          name: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          labelEn?: string;
          labelEs?: string;
          name?: string;
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
          planPriceId: number | null;
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
          planPriceId?: number | null;
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
          planPriceId?: number | null;
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
          },
          {
            foreignKeyName: "Subscription_planPriceId_fkey";
            columns: ["planPriceId"];
            isOneToOne: false;
            referencedRelation: "PlanPrice";
            referencedColumns: ["id"];
          }
        ];
      };
      SubscriptionHistory: {
        Row: {
          createdAt: string;
          endDate: string | null;
          event: string;
          id: number;
          planPriceId: number | null;
          startDate: string | null;
          subscriptionId: number;
        };
        Insert: {
          createdAt?: string;
          endDate?: string | null;
          event: string;
          id?: number;
          planPriceId?: number | null;
          startDate?: string | null;
          subscriptionId: number;
        };
        Update: {
          createdAt?: string;
          endDate?: string | null;
          event?: string;
          id?: number;
          planPriceId?: number | null;
          startDate?: string | null;
          subscriptionId?: number;
        };
        Relationships: [
          {
            foreignKeyName: "SubscriptionHistory_planPriceId_fkey";
            columns: ["planPriceId"];
            isOneToOne: false;
            referencedRelation: "PlanPrice";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "SubscriptionHistory_subscriptionId_fkey";
            columns: ["subscriptionId"];
            isOneToOne: false;
            referencedRelation: "Subscription";
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
            referencedRelation: "Type";
            referencedColumns: ["id"];
          }
        ];
      };
      Type: {
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
      Visit: {
        Row: {
          canceledAt: string | null;
          clientId: number | null;
          code: string | null;
          companionsCount: number;
          createdAt: string;
          eventId: number;
          id: number;
          isAttended: boolean;
          isCanceled: boolean;
          isConfirmed: boolean;
        };
        Insert: {
          canceledAt?: string | null;
          clientId?: number | null;
          code?: string | null;
          companionsCount?: number;
          createdAt?: string;
          eventId: number;
          id?: number;
          isAttended?: boolean;
          isCanceled?: boolean;
          isConfirmed?: boolean;
        };
        Update: {
          canceledAt?: string | null;
          clientId?: number | null;
          code?: string | null;
          companionsCount?: number;
          createdAt?: string;
          eventId?: number;
          id?: number;
          isAttended?: boolean;
          isCanceled?: boolean;
          isConfirmed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "Visit_clientId_fkey";
            columns: ["clientId"];
            isOneToOne: false;
            referencedRelation: "ClientProfile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Visit_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Event";
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
      "ENUM(AssetTypes)": "fiat" | "crypto";
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
      "ENUM(AssetTypes)": ["fiat", "crypto"],
    },
  },
} as const;

export type TypedSupabaseClient = SupabaseClient<Database>;
