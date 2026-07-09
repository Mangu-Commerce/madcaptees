// ============================================
// Madcap Tees — Supabase Database Types
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          base_price: number;
          sale_price: number | null;
          category: string;
          tags: string[];
          themes: string[];
          published: boolean;
          featured: boolean;
          best_seller: boolean;
          made_to_order: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          base_price: number;
          sale_price?: number | null;
          category?: string;
          tags?: string[];
          themes?: string[];
          published?: boolean;
          featured?: boolean;
          best_seller?: boolean;
          made_to_order?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          base_price?: number;
          sale_price?: number | null;
          category?: string;
          tags?: string[];
          themes?: string[];
          published?: boolean;
          featured?: boolean;
          best_seller?: boolean;
          made_to_order?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          is_primary: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string;
          sku: string | null;
          pod_variant_id: string | null;
          price_adjustment: number;
          stock: number | null;
          available: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: string;
          color: string;
          sku?: string | null;
          pod_variant_id?: string | null;
          price_adjustment?: number;
          stock?: number | null;
          available?: boolean;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string;
          color?: string;
          sku?: string | null;
          pod_variant_id?: string | null;
          price_adjustment?: number;
          stock?: number | null;
          available?: boolean;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
        };
      };
      product_collections: {
        Row: {
          product_id: string;
          collection_id: string;
        };
        Insert: {
          product_id: string;
          collection_id: string;
        };
        Update: {
          product_id?: string;
          collection_id?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          total_amount: number;
          subtotal: number;
          shipping_cost: number;
          status: string;
          email: string;
          shipping_address: Json;
          billing_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount: number;
          subtotal: number;
          shipping_cost?: number;
          status?: string;
          email: string;
          shipping_address: Json;
          billing_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount?: number;
          subtotal?: number;
          shipping_cost?: number;
          status?: string;
          email?: string;
          shipping_address?: Json;
          billing_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_variant_id: string;
          title_at_time: string;
          size_at_time: string;
          color_at_time: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_variant_id: string;
          title_at_time: string;
          size_at_time: string;
          color_at_time: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_variant_id?: string;
          title_at_time?: string;
          size_at_time?: string;
          color_at_time?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          percent_off: number | null;
          amount_off: number | null;
          active: boolean;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          percent_off?: number | null;
          amount_off?: number | null;
          active?: boolean;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          percent_off?: number | null;
          amount_off?: number | null;
          active?: boolean;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
        };
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
  };
}
