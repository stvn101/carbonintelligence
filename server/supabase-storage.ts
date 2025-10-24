import { supabase, isSupabaseConfigured, type Database } from './supabase';
import type { IStorage } from './storage';
import type {
  User, InsertUser, Project, InsertProject,
  Emission, InsertEmission, RegulatoryAlert, InsertRegulatoryAlert,
  CarbonBudget, InsertCarbonBudget, Investment, InsertInvestment,
  AiInsight, InsertAiInsight, CarbonEmbodiedData, InsertCarbonEmbodiedData,
  LiveCarbonMetrics, InsertLiveCarbonMetrics, CarbonReductionTactics, InsertCarbonReductionTactics,
  MlModel, InsertMlModel, Integration, InsertIntegration,
  CarbonPattern, InsertCarbonPattern,
  GreenStarRating, InsertGreenStarRating, NabersRating, InsertNabersRating,
  NccCompliance, InsertNccCompliance, RatingAssessment, InsertRatingAssessment,
  StateBuildingRegulation, InsertStateBuildingRegulation,
  FederalComplianceTracking, InsertFederalComplianceTracking
} from '@shared/schema';

// Helper function to safely convert dates to ISO strings
function toISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  if (typeof date === 'string') return date;
  return date.toISOString();
}

export class SupabaseStorage implements Partial<IStorage> {
  private ensureConfigured(): void {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }
  }
  /**
   * Fetch all projects from Supabase carbon_projects table
   */
  async getAllProjects(): Promise<Project[]> {
    this.ensureConfigured();
    
    const { data, error } = await supabase!
      .from('carbon_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return [];
    }

    // Map Supabase data to Project type
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      location: row.location,
      status: row.status,
      carbonFootprint: row.carbon_footprint,
      targetEmissions: row.target_emissions,
      progress: row.progress,
      startDate: row.start_date ? new Date(row.start_date) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      materials: row.materials,
      energyConsumption: row.energy_consumption,
      transportationEmissions: row.transportation_emissions,
      createdAt: new Date(row.created_at)
    }));
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<Project | undefined> {
    this.ensureConfigured();
    
    const { data, error } = await supabase!
      .from('carbon_projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching project:', error);
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      location: data.location,
      status: data.status,
      carbonFootprint: data.carbon_footprint,
      targetEmissions: data.target_emissions,
      progress: data.progress,
      startDate: data.start_date ? new Date(data.start_date) : null,
      endDate: data.end_date ? new Date(data.end_date) : null,
      materials: data.materials,
      energyConsumption: data.energy_consumption,
      transportationEmissions: data.transportation_emissions,
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * Create a new project in Supabase
   * Requires authentication for write operations
   */
  async createProject(insertProject: InsertProject): Promise<Project> {
    this.ensureConfigured();
    
    const { data, error } = await supabase!
      .from('carbon_projects')
      .insert({
        name: insertProject.name,
        type: insertProject.type,
        location: insertProject.location,
        status: insertProject.status,
        carbon_footprint: insertProject.carbonFootprint,
        target_emissions: insertProject.targetEmissions,
        progress: insertProject.progress ?? 0,
        start_date: toISOString(insertProject.startDate),
        end_date: toISOString(insertProject.endDate),
        materials: insertProject.materials || null,
        energy_consumption: insertProject.energyConsumption || null,
        transportation_emissions: insertProject.transportationEmissions || null
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create project: ${error?.message || 'Unknown error'}`);
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      location: data.location,
      status: data.status,
      carbonFootprint: data.carbon_footprint,
      targetEmissions: data.target_emissions,
      progress: data.progress,
      startDate: data.start_date ? new Date(data.start_date) : null,
      endDate: data.end_date ? new Date(data.end_date) : null,
      materials: data.materials,
      energyConsumption: data.energy_consumption,
      transportationEmissions: data.transportation_emissions,
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * Update an existing project
   * Requires authentication for write operations
   */
  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    this.ensureConfigured();
    
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.carbonFootprint !== undefined) updateData.carbon_footprint = updates.carbonFootprint;
    if (updates.targetEmissions !== undefined) updateData.target_emissions = updates.targetEmissions;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.startDate !== undefined) updateData.start_date = toISOString(updates.startDate);
    if (updates.endDate !== undefined) updateData.end_date = toISOString(updates.endDate);
    if (updates.materials !== undefined) updateData.materials = updates.materials;
    if (updates.energyConsumption !== undefined) updateData.energy_consumption = updates.energyConsumption;
    if (updates.transportationEmissions !== undefined) updateData.transportation_emissions = updates.transportationEmissions;

    const { data, error } = await supabase!
      .from('carbon_projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update project: ${error?.message || 'Unknown error'}`);
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      location: data.location,
      status: data.status,
      carbonFootprint: data.carbon_footprint,
      targetEmissions: data.target_emissions,
      progress: data.progress,
      startDate: data.start_date ? new Date(data.start_date) : null,
      endDate: data.end_date ? new Date(data.end_date) : null,
      materials: data.materials,
      energyConsumption: data.energy_consumption,
      transportationEmissions: data.transportation_emissions,
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * Delete a project
   * Requires authentication for write operations
   */
  async deleteProject(id: number): Promise<void> {
    this.ensureConfigured();
    
    const { error } = await supabase!
      .from('carbon_projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  /**
   * Fetch all materials from unified_materials table
   */
  async getCarbonEmbodiedData(projectId?: number): Promise<CarbonEmbodiedData[]> {
    this.ensureConfigured();
    
    let query = supabase!
      .from('unified_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId !== undefined) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching materials from Supabase:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      materialType: row.material_type,
      materialSubtype: row.material_subtype,
      quantity: row.quantity,
      unit: row.unit,
      embodiedCarbon: row.embodied_carbon,
      totalEmbodiedCarbon: row.total_embodied_carbon,
      supplier: row.supplier,
      transportDistance: row.transport_distance,
      transportMode: row.transport_mode,
      transportEmissions: row.transport_emissions,
      recycledContent: row.recycled_content,
      dataSource: row.data_source,
      confidence: row.confidence,
      installationDate: row.installation_date ? new Date(row.installation_date) : null,
      projectId: row.project_id,
      certifications: null,
      wastePercentage: null,
      endOfLifeScenario: null,
      createdAt: new Date(row.created_at),
      updatedAt: null
    }));
  }

  /**
   * Create embodied carbon data entry
   * Requires authentication for write operations
   */
  async createCarbonEmbodiedData(data: InsertCarbonEmbodiedData): Promise<CarbonEmbodiedData> {
    this.ensureConfigured();
    
    const { data: result, error } = await supabase!
      .from('unified_materials')
      .insert({
        material_type: data.materialType,
        material_subtype: data.materialSubtype || null,
        quantity: data.quantity,
        unit: data.unit,
        embodied_carbon: data.embodiedCarbon,
        total_embodied_carbon: data.totalEmbodiedCarbon,
        supplier: data.supplier || null,
        transport_distance: data.transportDistance || null,
        transport_mode: data.transportMode || null,
        transport_emissions: data.transportEmissions || null,
        recycled_content: data.recycledContent || null,
        data_source: data.dataSource,
        confidence: data.confidence || null,
        installation_date: toISOString(data.installationDate),
        project_id: data.projectId || null
      })
      .select()
      .single();

    if (error || !result) {
      throw new Error(`Failed to create material data: ${error?.message || 'Unknown error'}`);
    }

    return {
      id: result.id,
      materialType: result.material_type,
      materialSubtype: result.material_subtype,
      quantity: result.quantity,
      unit: result.unit,
      embodiedCarbon: result.embodied_carbon,
      totalEmbodiedCarbon: result.total_embodied_carbon,
      supplier: result.supplier,
      transportDistance: result.transport_distance,
      transportMode: result.transport_mode,
      transportEmissions: result.transport_emissions,
      recycledContent: result.recycled_content,
      dataSource: result.data_source,
      confidence: result.confidence,
      installationDate: result.installation_date ? new Date(result.installation_date) : null,
      projectId: result.project_id,
      certifications: null,
      wastePercentage: null,
      endOfLifeScenario: null,
      createdAt: new Date(result.created_at),
      updatedAt: null
    };
  }

  /**
   * Insert analytics summary into carbon_reports table
   */
  async insertCarbonReport(report: {
    reportType: string;
    projectId?: number;
    summaryData: any;
    totalEmissions?: string;
    scope1Emissions?: string;
    scope2Emissions?: string;
    scope3Emissions?: string;
    recommendations?: any;
    createdBy?: number;
  }): Promise<any> {
    this.ensureConfigured();
    
    const { data, error } = await supabase!
      .from('carbon_reports')
      .insert({
        report_type: report.reportType,
        project_id: report.projectId || null,
        summary_data: report.summaryData,
        total_emissions: report.totalEmissions || null,
        scope1_emissions: report.scope1Emissions || null,
        scope2_emissions: report.scope2Emissions || null,
        scope3_emissions: report.scope3Emissions || null,
        recommendations: report.recommendations || null,
        created_by: report.createdBy || null
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert carbon report: ${error?.message || 'Unknown error'}`);
    }

    return data;
  }

  /**
   * Fetch carbon reports
   */
  async getCarbonReports(projectId?: number): Promise<any[]> {
    this.ensureConfigured();
    
    let query = supabase!
      .from('carbon_reports')
      .select('*')
      .order('generated_at', { ascending: false });

    if (projectId !== undefined) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching carbon reports:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update embodied carbon data entry
   */
  async updateCarbonEmbodiedData(id: number, updates: Partial<InsertCarbonEmbodiedData>): Promise<CarbonEmbodiedData> {
    this.ensureConfigured();
    
    const updateData: any = {};
    
    if (updates.materialType !== undefined) updateData.material_type = updates.materialType;
    if (updates.materialSubtype !== undefined) updateData.material_subtype = updates.materialSubtype;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.unit !== undefined) updateData.unit = updates.unit;
    if (updates.embodiedCarbon !== undefined) updateData.embodied_carbon = updates.embodiedCarbon;
    if (updates.totalEmbodiedCarbon !== undefined) updateData.total_embodied_carbon = updates.totalEmbodiedCarbon;
    if (updates.supplier !== undefined) updateData.supplier = updates.supplier;
    if (updates.transportDistance !== undefined) updateData.transport_distance = updates.transportDistance;
    if (updates.transportMode !== undefined) updateData.transport_mode = updates.transportMode;
    if (updates.transportEmissions !== undefined) updateData.transport_emissions = updates.transportEmissions;
    if (updates.recycledContent !== undefined) updateData.recycled_content = updates.recycledContent;
    if (updates.dataSource !== undefined) updateData.data_source = updates.dataSource;
    if (updates.confidence !== undefined) updateData.confidence = updates.confidence;
    if (updates.installationDate !== undefined) updateData.installation_date = toISOString(updates.installationDate);
    if (updates.projectId !== undefined) updateData.project_id = updates.projectId;

    const { data, error } = await supabase!
      .from('unified_materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update material data: ${error?.message || 'Unknown error'}`);
    }

    return {
      id: data.id,
      materialType: data.material_type,
      materialSubtype: data.material_subtype,
      quantity: data.quantity,
      unit: data.unit,
      embodiedCarbon: data.embodied_carbon,
      totalEmbodiedCarbon: data.total_embodied_carbon,
      supplier: data.supplier,
      transportDistance: data.transport_distance,
      transportMode: data.transport_mode,
      transportEmissions: data.transport_emissions,
      recycledContent: data.recycled_content,
      dataSource: data.data_source,
      confidence: data.confidence,
      installationDate: data.installation_date ? new Date(data.installation_date) : null,
      projectId: data.project_id,
      certifications: null,
      wastePercentage: null,
      endOfLifeScenario: null,
      createdAt: new Date(data.created_at),
      updatedAt: null
    };
  }

  /**
   * Delete embodied carbon data entry
   */
  async deleteCarbonEmbodiedData(id: number): Promise<void> {
    this.ensureConfigured();
    
    const { error } = await supabase!
      .from('unified_materials')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete material data: ${error.message}`);
    }
  }
}

// Export the SupabaseStorage instance for direct use
export const supabaseStorage = new SupabaseStorage();
