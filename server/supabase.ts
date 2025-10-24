import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are available
// This allows the app to fall back to MemStorage when Supabase is not configured
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => supabase !== null;

export type Database = {
  public: {
    Tables: {
      carbon_projects: {
        Row: {
          id: number;
          name: string;
          type: string;
          location: string;
          status: string;
          carbon_footprint: string;
          target_emissions: string;
          progress: number;
          start_date: string | null;
          end_date: string | null;
          materials: any | null;
          energy_consumption: string | null;
          transportation_emissions: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          type: string;
          location: string;
          status: string;
          carbon_footprint: string;
          target_emissions: string;
          progress?: number;
          start_date?: string | null;
          end_date?: string | null;
          materials?: any | null;
          energy_consumption?: string | null;
          transportation_emissions?: string | null;
        };
      };
      unified_materials: {
        Row: {
          id: number;
          material_type: string;
          material_subtype: string | null;
          quantity: string;
          unit: string;
          embodied_carbon: string;
          total_embodied_carbon: string;
          supplier: string | null;
          transport_distance: string | null;
          transport_mode: string | null;
          transport_emissions: string | null;
          recycled_content: string | null;
          data_source: string;
          confidence: string | null;
          installation_date: string | null;
          project_id: number | null;
          created_at: string;
        };
        Insert: {
          material_type: string;
          material_subtype?: string | null;
          quantity: string;
          unit: string;
          embodied_carbon: string;
          total_embodied_carbon: string;
          supplier?: string | null;
          transport_distance?: string | null;
          transport_mode?: string | null;
          transport_emissions?: string | null;
          recycled_content?: string | null;
          data_source: string;
          confidence?: string | null;
          installation_date?: string | null;
          project_id?: number | null;
        };
      };
      carbon_reports: {
        Row: {
          id: number;
          report_type: string;
          project_id: number | null;
          generated_at: string;
          summary_data: any;
          total_emissions: string | null;
          scope1_emissions: string | null;
          scope2_emissions: string | null;
          scope3_emissions: string | null;
          recommendations: any | null;
          created_by: number | null;
        };
        Insert: {
          report_type: string;
          project_id?: number | null;
          summary_data: any;
          total_emissions?: string | null;
          scope1_emissions?: string | null;
          scope2_emissions?: string | null;
          scope3_emissions?: string | null;
          recommendations?: any | null;
          created_by?: number | null;
        };
      };
    };
  };
};
