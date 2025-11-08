import {
  users, projects, emissions, regulatoryAlerts, carbonBudgets, investments, aiInsights,
  carbonEmbodiedData, liveCarbonMetrics, carbonReductionTactics, mlModels, integrations, carbonPatterns,
  greenStarRatings, nabersRatings, nccCompliance, ratingAssessments,
  stateBuildingRegulations, federalComplianceTracking,
  type User, type InsertUser, type UpsertUser, type Project, type InsertProject,
  type Emission, type InsertEmission, type RegulatoryAlert, type InsertRegulatoryAlert,
  type CarbonBudget, type InsertCarbonBudget, type Investment, type InsertInvestment,
  type AiInsight, type InsertAiInsight, type CarbonEmbodiedData, type InsertCarbonEmbodiedData,
  type LiveCarbonMetrics, type InsertLiveCarbonMetrics, type CarbonReductionTactics, type InsertCarbonReductionTactics,
  type MlModel, type InsertMlModel, type Integration, type InsertIntegration,
  type CarbonPattern, type InsertCarbonPattern,
  type GreenStarRating, type InsertGreenStarRating, type NabersRating, type InsertNabersRating,
  type NccCompliance, type InsertNccCompliance, type RatingAssessment, type InsertRatingAssessment,
  type StateBuildingRegulation, type InsertStateBuildingRegulation,
  type FederalComplianceTracking, type InsertFederalComplianceTracking
} from "@shared/schema";

export interface IStorage {
  // User operations (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Emission operations
  getEmissionsByProject(projectId: number): Promise<Emission[]>;
  getAllEmissions(): Promise<Emission[]>;
  createEmission(emission: InsertEmission): Promise<Emission>;
  updateEmission(id: number, updates: Partial<InsertEmission>): Promise<Emission>;
  deleteEmission(id: number): Promise<void>;

  // Regulatory operations
  getAllRegulatoryAlerts(): Promise<RegulatoryAlert[]>;
  getActiveRegulatoryAlerts(): Promise<RegulatoryAlert[]>;
  createRegulatoryAlert(alert: InsertRegulatoryAlert): Promise<RegulatoryAlert>;
  updateRegulatoryAlert(id: number, updates: Partial<InsertRegulatoryAlert>): Promise<RegulatoryAlert>;
  deleteRegulatoryAlert(id: number): Promise<void>;

  // Carbon budget operations
  getCarbonBudget(year: number): Promise<CarbonBudget | undefined>;
  createCarbonBudget(budget: InsertCarbonBudget): Promise<CarbonBudget>;
  updateCarbonBudget(id: number, updates: Partial<InsertCarbonBudget>): Promise<CarbonBudget>;
  deleteCarbonBudget(id: number): Promise<void>;

  // Investment operations
  getAllInvestments(): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, updates: Partial<InsertInvestment>): Promise<Investment>;
  deleteInvestment(id: number): Promise<void>;

  // AI insights operations
  getAllAiInsights(): Promise<AiInsight[]>;
  getActiveAiInsights(): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  updateAiInsight(id: number, updates: Partial<InsertAiInsight>): Promise<AiInsight>;
  deleteAiInsight(id: number): Promise<void>;

  // Live carbon metrics operations
  getLiveCarbonMetrics(category?: string): Promise<LiveCarbonMetrics[]>;
  createLiveCarbonMetric(metric: InsertLiveCarbonMetrics): Promise<LiveCarbonMetrics>;
  updateLiveCarbonMetric(id: number, updates: Partial<InsertLiveCarbonMetrics>): Promise<LiveCarbonMetrics>;
  deleteLiveCarbonMetric(id: number): Promise<void>;
  
  // Carbon embodied data operations
  getCarbonEmbodiedData(projectId?: number): Promise<CarbonEmbodiedData[]>;
  createCarbonEmbodiedData(data: InsertCarbonEmbodiedData): Promise<CarbonEmbodiedData>;
  updateCarbonEmbodiedData(id: number, updates: Partial<InsertCarbonEmbodiedData>): Promise<CarbonEmbodiedData>;
  deleteCarbonEmbodiedData(id: number): Promise<void>;
  
  // Carbon reduction tactics operations
  getCarbonReductionTactics(priority?: string): Promise<CarbonReductionTactics[]>;
  createCarbonReductionTactic(tactic: InsertCarbonReductionTactics): Promise<CarbonReductionTactics>;
  updateCarbonReductionTactic(id: number, updates: Partial<InsertCarbonReductionTactics>): Promise<CarbonReductionTactics>;
  deleteCarbonReductionTactic(id: number): Promise<void>;
  
  // ML Models operations
  getAllMlModels(): Promise<MlModel[]>;
  getMlModel(id: number): Promise<MlModel | undefined>;
  getMlModelsByType(type: string): Promise<MlModel[]>;
  createMlModel(model: InsertMlModel): Promise<MlModel>;
  updateMlModel(id: number, updates: Partial<InsertMlModel>): Promise<MlModel>;
  deleteMlModel(id: number): Promise<void>;
  
  // Integrations operations
  getAllIntegrations(): Promise<Integration[]>;
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrationByPlatform(platform: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, updates: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: number): Promise<void>;
  
  // Carbon Patterns operations
  getAllCarbonPatterns(): Promise<CarbonPattern[]>;
  getCarbonPattern(id: number): Promise<CarbonPattern | undefined>;
  getCarbonPatternsByType(patternType: string): Promise<CarbonPattern[]>;
  createCarbonPattern(pattern: InsertCarbonPattern): Promise<CarbonPattern>;
  updateCarbonPattern(id: number, updates: Partial<InsertCarbonPattern>): Promise<CarbonPattern>;
  deleteCarbonPattern(id: number): Promise<void>;

  // Australian Rating Systems operations
  
  // Green Star operations
  getGreenStarRatings(projectId?: number): Promise<GreenStarRating[]>;
  getGreenStarRating(id: number): Promise<GreenStarRating | undefined>;
  createGreenStarRating(rating: InsertGreenStarRating): Promise<GreenStarRating>;
  updateGreenStarRating(id: number, updates: Partial<InsertGreenStarRating>): Promise<GreenStarRating>;
  deleteGreenStarRating(id: number): Promise<void>;
  
  // NABERS operations
  getNabersRatings(projectId?: number): Promise<NabersRating[]>;
  getNabersRating(id: number): Promise<NabersRating | undefined>;
  getNabersRatingsByType(ratingType: string): Promise<NabersRating[]>;
  createNabersRating(rating: InsertNabersRating): Promise<NabersRating>;
  updateNabersRating(id: number, updates: Partial<InsertNabersRating>): Promise<NabersRating>;
  deleteNabersRating(id: number): Promise<void>;
  
  // NCC Compliance operations
  getNccCompliance(projectId?: number): Promise<NccCompliance[]>;
  getNccComplianceByProject(projectId: number): Promise<NccCompliance | undefined>;
  createNccCompliance(compliance: InsertNccCompliance): Promise<NccCompliance>;
  updateNccCompliance(id: number, updates: Partial<InsertNccCompliance>): Promise<NccCompliance>;
  deleteNccCompliance(id: number): Promise<void>;
  
  // Rating Assessment operations
  getRatingAssessments(projectId?: number): Promise<RatingAssessment[]>;
  getRatingAssessment(id: number): Promise<RatingAssessment | undefined>;
  getRatingAssessmentsByType(assessmentType: string): Promise<RatingAssessment[]>;
  createRatingAssessment(assessment: InsertRatingAssessment): Promise<RatingAssessment>;
  updateRatingAssessment(id: number, updates: Partial<InsertRatingAssessment>): Promise<RatingAssessment>;
  deleteRatingAssessment(id: number): Promise<void>;

  // Australian regulatory framework operations
  
  // State Building Regulations operations
  getStateBuildingRegulations(state?: string): Promise<StateBuildingRegulation[]>;
  getStateBuildingRegulation(id: number): Promise<StateBuildingRegulation | undefined>;
  getStateBuildingRegulationsByType(regulationType: string): Promise<StateBuildingRegulation[]>;
  createStateBuildingRegulation(regulation: InsertStateBuildingRegulation): Promise<StateBuildingRegulation>;
  updateStateBuildingRegulation(id: number, updates: Partial<InsertStateBuildingRegulation>): Promise<StateBuildingRegulation>;
  deleteStateBuildingRegulation(id: number): Promise<void>;
  
  // Federal Compliance Tracking operations (NGER & Safeguard)
  getFederalComplianceTracking(projectId?: number): Promise<FederalComplianceTracking[]>;
  getFederalComplianceTrackingById(id: number): Promise<FederalComplianceTracking | undefined>;
  getFederalComplianceByProject(projectId: number): Promise<FederalComplianceTracking | undefined>;
  createFederalComplianceTracking(compliance: InsertFederalComplianceTracking): Promise<FederalComplianceTracking>;
  updateFederalComplianceTracking(id: number, updates: Partial<InsertFederalComplianceTracking>): Promise<FederalComplianceTracking>;
  deleteFederalComplianceTracking(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<number, Project>;
  private emissions: Map<number, Emission>;
  private regulatoryAlerts: Map<number, RegulatoryAlert>;
  private carbonBudgets: Map<number, CarbonBudget>;
  private investments: Map<number, Investment>;
  private aiInsights: Map<number, AiInsight>;
  private carbonEmbodiedData: Map<number, CarbonEmbodiedData>;
  private liveCarbonMetrics: Map<number, LiveCarbonMetrics>;
  private carbonReductionTactics: Map<number, CarbonReductionTactics>;
  private mlModels: Map<number, MlModel>;
  private integrations: Map<number, Integration>;
  private carbonPatterns: Map<number, CarbonPattern>;
  private greenStarRatings: Map<number, GreenStarRating>;
  private nabersRatings: Map<number, NabersRating>;
  private nccCompliance: Map<number, NccCompliance>;
  private ratingAssessments: Map<number, RatingAssessment>;
  private stateBuildingRegulations: Map<number, StateBuildingRegulation>;
  private federalComplianceTracking: Map<number, FederalComplianceTracking>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.emissions = new Map();
    this.regulatoryAlerts = new Map();
    this.carbonBudgets = new Map();
    this.investments = new Map();
    this.aiInsights = new Map();
    this.carbonEmbodiedData = new Map();
    this.liveCarbonMetrics = new Map();
    this.carbonReductionTactics = new Map();
    this.mlModels = new Map();
    this.integrations = new Map();
    this.carbonPatterns = new Map();
    this.greenStarRatings = new Map();
    this.nabersRatings = new Map();
    this.nccCompliance = new Map();
    this.ratingAssessments = new Map();
    this.stateBuildingRegulations = new Map();
    this.federalComplianceTracking = new Map();
    this.currentId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize with essential data structure only, no mock data
    const currentYear = new Date().getFullYear();
    
    // Create a default carbon budget for current year
    this.createCarbonBudget({
      year: currentYear,
      totalBudget: "0",
      allocatedBudget: "0",
      consumedBudget: "0",
      categories: {},
      projects: {},
      status: "active"
    });

    // Initialize live carbon metrics sample data
    this.initializeLiveCarbonData();
  }

  private initializeLiveCarbonData() {
    const now = new Date();
    const categories = ["materials", "energy", "transport", "waste"];
    
    // Create live carbon metrics
    categories.forEach((category, index) => {
      this.createLiveCarbonMetric({
        metricType: "embodied",
        value: (Math.random() * 1000 + 500).toFixed(3),
        unit: "tCO2e",
        timestamp: new Date(now.getTime() - index * 300000), // 5 min intervals
        category,
        trend: Math.random() > 0.5 ? "decreasing" : "increasing",
        changeFromPrevious: (Math.random() * 20 - 10).toFixed(2),
        benchmark: (Math.random() * 1200 + 600).toFixed(3),
        target: (Math.random() * 800 + 400).toFixed(3),
        alerts: Math.random() > 0.7 ? [{ type: "threshold_exceeded", message: "Above target" }] : []
      });
    });

    // Create carbon embodied data for Australian materials
    const materials = ["concrete", "steel", "aluminum", "timber", "glass"];
    materials.forEach((material, index) => {
      this.createCarbonEmbodiedData({
        materialType: material,
        materialSubtype: `structural_${material}`,
        quantity: (Math.random() * 100 + 50).toFixed(2),
        unit: material === "concrete" ? "m3" : "tonnes",
        embodiedCarbon: this.getAustralianCarbonFactor(material),
        totalEmbodiedCarbon: (Math.random() * 5500 + 1200).toFixed(2),
        supplier: `${material.charAt(0).toUpperCase()}${material.slice(1)} Australia Pty Ltd`,
        transportDistance: (Math.random() * 800 + 100).toFixed(2), // Australian distances
        transportMode: Math.random() > 0.5 ? "truck" : "rail",
        transportEmissions: (Math.random() * 50 + 10).toFixed(2),
        recycledContent: (Math.random() * 30).toFixed(2),
        dataSource: "integration",
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        installationDate: new Date()
      });
    });

    // Create AI-powered carbon reduction tactics
    const tactics = [
      {
        title: "Replace Standard Australian Concrete with Low-Carbon Alternative",
        description: "Substitute 40% of Portland cement with fly ash and GGBFS available in Australian markets. This high-impact substitution reduces embodied carbon while maintaining structural integrity. Source materials from Australian suppliers to minimize transport emissions.",
        category: "material_substitution",
        applicablePhases: ["design", "procurement"],
        potentialReduction: "2847.5",
        reductionPercentage: "18.7",
        implementationCost: "187500", // AUD
        paybackPeriod: 18,
        feasibilityScore: "0.87",
        priority: "high",
        implementationComplexity: "medium",
        timeline: "short_term",
        materialTypes: ["concrete"],
        evidenceBase: "case_study",
        source: "ai_generated",
        aiConfidence: "0.91"
      },
      {
        title: "Optimize Steel Frame Design with AI-Driven Topology",
        description: "Use AI topology optimization to reduce steel usage by 25% without compromising structural performance. Machine learning algorithms identify optimal material distribution patterns, eliminating unnecessary weight while ensuring safety factors.",
        category: "design_optimization",
        applicablePhases: ["design"],
        potentialReduction: "1923.2",
        reductionPercentage: "12.3",
        implementationCost: "112500", // AUD
        paybackPeriod: 12,
        feasibilityScore: "0.82",
        priority: "high",
        implementationComplexity: "high",
        timeline: "medium_term",
        materialTypes: ["steel"],
        evidenceBase: "research",
        source: "ai_generated",
        aiConfidence: "0.88"
      },
      {
        title: "Implement Local Material Sourcing Strategy",
        description: "Source 80% of materials within 100km radius to dramatically reduce transportation emissions. Establish regional supplier networks and optimize delivery routes using smart logistics. Critical for reducing Scope 3 emissions from transport.",
        category: "transport_optimization",
        applicablePhases: ["procurement"],
        potentialReduction: "1456.8",
        reductionPercentage: "9.4",
        implementationCost: "45000",
        paybackPeriod: 8,
        feasibilityScore: "0.94",
        priority: "medium",
        implementationComplexity: "low",
        timeline: "immediate",
        materialTypes: ["concrete", "steel", "timber"],
        evidenceBase: "case_study",
        source: "ai_generated",
        aiConfidence: "0.95"
      },
      {
        title: "Deploy Cross-Laminated Timber (CLT) for Mid-Rise",
        description: "Replace concrete and steel structural elements with engineered timber systems for buildings up to 12 stories. CLT provides carbon sequestration benefits while reducing embodied carbon by up to 75% compared to concrete.",
        category: "material_substitution",
        applicablePhases: ["design", "procurement"],
        potentialReduction: "3651.2",
        reductionPercentage: "23.8",
        implementationCost: "180000",
        paybackPeriod: 24,
        feasibilityScore: "0.76",
        priority: "critical",
        implementationComplexity: "medium",
        timeline: "medium_term",
        materialTypes: ["timber"],
        evidenceBase: "case_study",
        source: "ai_generated",
        aiConfidence: "0.87"
      },
      {
        title: "Integrate Recycled Steel with Blockchain Verification",
        description: "Use blockchain-verified recycled steel content (minimum 90%) with full supply chain transparency. Smart contracts ensure authentic recycled content verification and carbon credit allocation. Revolutionary approach to circular economy implementation.",
        category: "circular_economy",
        applicablePhases: ["procurement", "construction"],
        potentialReduction: "2234.7",
        reductionPercentage: "14.6",
        implementationCost: "95000",
        paybackPeriod: 15,
        feasibilityScore: "0.73",
        priority: "high",
        implementationComplexity: "high",
        timeline: "long_term",
        materialTypes: ["steel"],
        evidenceBase: "expert_opinion",
        source: "ai_generated",
        aiConfidence: "0.79"
      }
    ];

    tactics.forEach(tactic => {
      this.createCarbonReductionTactic(tactic);
    });
  }

  private getAustralianCarbonFactor(material: string): string {
    // Australian NGER-aligned embodied carbon factors (tCO2e per unit)
    const australianFactors: { [key: string]: number } = {
      concrete: 0.35, // Higher due to Australian cement production and energy grid
      steel: 2.4,     // Higher due to coal-based Australian steel production  
      aluminum: 8.2,  // Higher due to energy-intensive Australian smelting
      timber: 0.02,   // Lower due to Australian sustainable forestry practices
      glass: 0.85     // Australian manufacturing processes
    };
    
    const baseFactor = australianFactors[material] || 0.15;
    const variance = baseFactor * 0.2; // +/- 20% variance
    const factor = baseFactor + (Math.random() * variance * 2 - variance);
    
    return (factor * (Math.random() * 100 + 50)).toFixed(3);
  }

  // User operations (Replit Auth compatible)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = userData.id ? this.users.get(userData.id) : undefined;
    if (existing) {
      const updatedUser: User = {
        ...existing,
        email: userData.email ?? existing.email ?? null,
        firstName: userData.firstName ?? existing.firstName ?? null,
        lastName: userData.lastName ?? existing.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? existing.profileImageUrl ?? null,
        updatedAt: new Date(),
      };
      this.users.set(updatedUser.id, updatedUser);
      return updatedUser;
    }

    const newUser: User = {
      id: userData.id || `user_${this.currentId++}`,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user_${this.currentId++}`;
    const user: User = { 
      id,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser: User = {
      ...user,
      email: updates.email ?? user.email ?? null,
      firstName: updates.firstName ?? user.firstName ?? null,
      lastName: updates.lastName ?? user.lastName ?? null,
      profileImageUrl: updates.profileImageUrl ?? user.profileImageUrl ?? null,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.users.has(id)) throw new Error('User not found');
    this.users.delete(id);
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      progress: insertProject.progress ?? 0,
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      materials: insertProject.materials || null,
      energyConsumption: insertProject.energyConsumption || null,
      transportationEmissions: insertProject.transportationEmissions || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error('Project not found');
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    if (!this.projects.has(id)) throw new Error('Project not found');
    this.projects.delete(id);
  }

  // Emission operations
  async getEmissionsByProject(projectId: number): Promise<Emission[]> {
    return Array.from(this.emissions.values()).filter(e => e.projectId === projectId);
  }

  async getAllEmissions(): Promise<Emission[]> {
    return Array.from(this.emissions.values());
  }

  async createEmission(insertEmission: InsertEmission): Promise<Emission> {
    const id = this.currentId++;
    const emission: Emission = { 
      ...insertEmission, 
      id,
      unit: insertEmission.unit || "tCO2e",
      verified: insertEmission.verified ?? false,
      source: insertEmission.source || null,
      projectId: insertEmission.projectId || null
    };
    this.emissions.set(id, emission);
    return emission;
  }

  async updateEmission(id: number, updates: Partial<InsertEmission>): Promise<Emission> {
    const emission = this.emissions.get(id);
    if (!emission) throw new Error('Emission not found');
    
    const updatedEmission = { ...emission, ...updates };
    this.emissions.set(id, updatedEmission);
    return updatedEmission;
  }

  async deleteEmission(id: number): Promise<void> {
    if (!this.emissions.has(id)) throw new Error('Emission not found');
    this.emissions.delete(id);
  }

  // Regulatory operations
  async getAllRegulatoryAlerts(): Promise<RegulatoryAlert[]> {
    return Array.from(this.regulatoryAlerts.values());
  }

  async getActiveRegulatoryAlerts(): Promise<RegulatoryAlert[]> {
    return Array.from(this.regulatoryAlerts.values()).filter(alert => alert.status === 'active');
  }

  async createRegulatoryAlert(insertAlert: InsertRegulatoryAlert): Promise<RegulatoryAlert> {
    const id = this.currentId++;
    const alert: RegulatoryAlert = { 
      ...insertAlert, 
      id, 
      updatedAt: new Date(),
      createdAt: new Date(),
      status: insertAlert.status || "active",
      effectiveDate: insertAlert.effectiveDate || null,
      deadline: insertAlert.deadline || null,
      affectedProjects: insertAlert.affectedProjects || null,
      source: insertAlert.source || null,
      impact: insertAlert.impact || null,
      regulatoryFramework: insertAlert.regulatoryFramework || null,
      jurisdiction: insertAlert.jurisdiction || null,
      legislativeInstrument: insertAlert.legislativeInstrument || null,
      complianceThresholds: insertAlert.complianceThresholds || null,
      reportingRequirements: insertAlert.reportingRequirements || null,
      penaltyFramework: insertAlert.penaltyFramework || null,
      relatedGreenStarCategories: insertAlert.relatedGreenStarCategories || null,
      relatedNabersMetrics: insertAlert.relatedNabersMetrics || null,
      relatedNccSections: insertAlert.relatedNccSections || null,
      complianceScore: insertAlert.complianceScore || null
    };
    this.regulatoryAlerts.set(id, alert);
    return alert;
  }

  async updateRegulatoryAlert(id: number, updates: Partial<InsertRegulatoryAlert>): Promise<RegulatoryAlert> {
    const alert = this.regulatoryAlerts.get(id);
    if (!alert) throw new Error('Regulatory alert not found');
    
    const updatedAlert = { ...alert, ...updates };
    this.regulatoryAlerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteRegulatoryAlert(id: number): Promise<void> {
    if (!this.regulatoryAlerts.has(id)) throw new Error('Regulatory alert not found');
    this.regulatoryAlerts.delete(id);
  }

  // Carbon budget operations
  async getCarbonBudget(year: number): Promise<CarbonBudget | undefined> {
    return Array.from(this.carbonBudgets.values()).find(budget => budget.year === year);
  }

  async createCarbonBudget(insertBudget: InsertCarbonBudget): Promise<CarbonBudget> {
    const id = this.currentId++;
    const budget: CarbonBudget = { 
      ...insertBudget, 
      id,
      categories: insertBudget.categories || null,
      projects: insertBudget.projects || null,
      status: insertBudget.status || "active"
    };
    this.carbonBudgets.set(id, budget);
    return budget;
  }

  async updateCarbonBudget(id: number, updates: Partial<InsertCarbonBudget>): Promise<CarbonBudget> {
    const budget = this.carbonBudgets.get(id);
    if (!budget) throw new Error('Carbon budget not found');
    
    const updatedBudget = { ...budget, ...updates };
    this.carbonBudgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async deleteCarbonBudget(id: number): Promise<void> {
    if (!this.carbonBudgets.has(id)) throw new Error('Carbon budget not found');
    this.carbonBudgets.delete(id);
  }

  // Investment operations
  async getAllInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.currentId++;
    const investment: Investment = { 
      ...insertInvestment, 
      id, 
      createdAt: new Date(),
      status: insertInvestment.status || "proposed",
      priority: insertInvestment.priority || "medium",
      paybackPeriod: insertInvestment.paybackPeriod || null,
      roi: insertInvestment.roi || null
    };
    this.investments.set(id, investment);
    return investment;
  }

  async updateInvestment(id: number, updates: Partial<InsertInvestment>): Promise<Investment> {
    const investment = this.investments.get(id);
    if (!investment) throw new Error('Investment not found');
    
    const updatedInvestment = { ...investment, ...updates };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  async deleteInvestment(id: number): Promise<void> {
    if (!this.investments.has(id)) throw new Error('Investment not found');
    this.investments.delete(id);
  }

  // AI insights operations
  async getAllAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values());
  }

  async getActiveAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values()).filter(insight => insight.status === 'active');
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentId++;
    const insight: AiInsight = { 
      ...insertInsight, 
      id, 
      createdAt: new Date(),
      data: insertInsight.data || null,
      status: insertInsight.status || "active",
      priority: insertInsight.priority || "medium",
      confidence: insertInsight.confidence || null,
      modelVersion: insertInsight.modelVersion || null,
      accuracy: insertInsight.accuracy || null
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async updateAiInsight(id: number, updates: Partial<InsertAiInsight>): Promise<AiInsight> {
    const insight = this.aiInsights.get(id);
    if (!insight) throw new Error('AI Insight not found');
    
    const updatedInsight = { ...insight, ...updates };
    this.aiInsights.set(id, updatedInsight);
    return updatedInsight;
  }

  async deleteAiInsight(id: number): Promise<void> {
    if (!this.aiInsights.has(id)) throw new Error('AI Insight not found');
    this.aiInsights.delete(id);
  }

  // Live carbon metrics operations
  async getLiveCarbonMetrics(category?: string): Promise<LiveCarbonMetrics[]> {
    const metrics = Array.from(this.liveCarbonMetrics.values());
    return category ? metrics.filter(m => m.category === category) : metrics;
  }

  async createLiveCarbonMetric(insertMetric: InsertLiveCarbonMetrics): Promise<LiveCarbonMetrics> {
    const id = this.currentId++;
    const metric: LiveCarbonMetrics = { 
      ...insertMetric, 
      id,
      unit: insertMetric.unit || "tCO2e",
      timestamp: insertMetric.timestamp || new Date(),
      projectId: insertMetric.projectId || null,
      category: insertMetric.category || null,
      subcategory: insertMetric.subcategory || null,
      benchmark: insertMetric.benchmark || null,
      target: insertMetric.target || null,
      trend: insertMetric.trend || null,
      changeFromPrevious: insertMetric.changeFromPrevious || null,
      alerts: insertMetric.alerts || null
    };
    this.liveCarbonMetrics.set(id, metric);
    return metric;
  }

  async updateLiveCarbonMetric(id: number, updates: Partial<InsertLiveCarbonMetrics>): Promise<LiveCarbonMetrics> {
    const metric = this.liveCarbonMetrics.get(id);
    if (!metric) throw new Error('Live carbon metric not found');
    
    const updatedMetric = { ...metric, ...updates };
    this.liveCarbonMetrics.set(id, updatedMetric);
    return updatedMetric;
  }

  async deleteLiveCarbonMetric(id: number): Promise<void> {
    if (!this.liveCarbonMetrics.has(id)) throw new Error('Live carbon metric not found');
    this.liveCarbonMetrics.delete(id);
  }

  // Carbon embodied data operations
  async getCarbonEmbodiedData(projectId?: number): Promise<CarbonEmbodiedData[]> {
    const data = Array.from(this.carbonEmbodiedData.values());
    return projectId ? data.filter(d => d.projectId === projectId) : data;
  }

  async createCarbonEmbodiedData(insertData: InsertCarbonEmbodiedData): Promise<CarbonEmbodiedData> {
    const id = this.currentId++;
    const data: CarbonEmbodiedData = { 
      ...insertData, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      projectId: insertData.projectId || null,
      materialSubtype: insertData.materialSubtype || null,
      supplier: insertData.supplier || null,
      certifications: insertData.certifications || null,
      transportDistance: insertData.transportDistance || null,
      transportMode: insertData.transportMode || null,
      transportEmissions: insertData.transportEmissions || null,
      wastePercentage: insertData.wastePercentage || null,
      recycledContent: insertData.recycledContent || null,
      endOfLifeScenario: insertData.endOfLifeScenario || null,
      installationDate: insertData.installationDate || null,
      confidence: insertData.confidence || null
    };
    this.carbonEmbodiedData.set(id, data);
    return data;
  }

  async updateCarbonEmbodiedData(id: number, updates: Partial<InsertCarbonEmbodiedData>): Promise<CarbonEmbodiedData> {
    const data = this.carbonEmbodiedData.get(id);
    if (!data) throw new Error('Carbon embodied data not found');
    
    const updatedData = { ...data, ...updates, updatedAt: new Date() };
    this.carbonEmbodiedData.set(id, updatedData);
    return updatedData;
  }

  async deleteCarbonEmbodiedData(id: number): Promise<void> {
    if (!this.carbonEmbodiedData.has(id)) throw new Error('Carbon embodied data not found');
    this.carbonEmbodiedData.delete(id);
  }

  // Carbon reduction tactics operations
  async getCarbonReductionTactics(priority?: string): Promise<CarbonReductionTactics[]> {
    const tactics = Array.from(this.carbonReductionTactics.values());
    return priority ? tactics.filter(t => t.priority === priority) : tactics;
  }

  async createCarbonReductionTactic(insertTactic: InsertCarbonReductionTactics): Promise<CarbonReductionTactics> {
    const id = this.currentId++;
    const tactic: CarbonReductionTactics = { 
      ...insertTactic, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      applicablePhases: insertTactic.applicablePhases || null,
      potentialReduction: insertTactic.potentialReduction || null,
      reductionPercentage: insertTactic.reductionPercentage || null,
      implementationCost: insertTactic.implementationCost || null,
      paybackPeriod: insertTactic.paybackPeriod || null,
      feasibilityScore: insertTactic.feasibilityScore || null,
      implementationComplexity: insertTactic.implementationComplexity || null,
      requiredResources: insertTactic.requiredResources || null,
      timeline: insertTactic.timeline || null,
      materialTypes: insertTactic.materialTypes || null,
      projectTypes: insertTactic.projectTypes || null,
      evidenceBase: insertTactic.evidenceBase || null,
      successMetrics: insertTactic.successMetrics || null,
      risks: insertTactic.risks || null,
      dependencies: insertTactic.dependencies || null,
      source: insertTactic.source || null,
      aiConfidence: insertTactic.aiConfidence || null
    };
    this.carbonReductionTactics.set(id, tactic);
    return tactic;
  }

  async updateCarbonReductionTactic(id: number, updates: Partial<InsertCarbonReductionTactics>): Promise<CarbonReductionTactics> {
    const tactic = this.carbonReductionTactics.get(id);
    if (!tactic) throw new Error('Carbon reduction tactic not found');
    
    const updatedTactic = { ...tactic, ...updates, updatedAt: new Date() };
    this.carbonReductionTactics.set(id, updatedTactic);
    return updatedTactic;
  }

  async deleteCarbonReductionTactic(id: number): Promise<void> {
    if (!this.carbonReductionTactics.has(id)) throw new Error('Carbon reduction tactic not found');
    this.carbonReductionTactics.delete(id);
  }

  // ML Models operations
  async getAllMlModels(): Promise<MlModel[]> {
    return Array.from(this.mlModels.values());
  }

  async getMlModel(id: number): Promise<MlModel | undefined> {
    return this.mlModels.get(id);
  }

  async getMlModelsByType(type: string): Promise<MlModel[]> {
    return Array.from(this.mlModels.values()).filter(model => model.type === type);
  }

  async createMlModel(insertModel: InsertMlModel): Promise<MlModel> {
    const id = this.currentId++;
    const model: MlModel = {
      ...insertModel,
      id,
      createdAt: new Date(),
      accuracy: insertModel.accuracy || null,
      trainingData: insertModel.trainingData || null,
      hyperparameters: insertModel.hyperparameters || null,
      status: insertModel.status || "active",
      companySpecific: insertModel.companySpecific ?? false,
      lastTrained: insertModel.lastTrained || null
    };
    this.mlModels.set(id, model);
    return model;
  }

  async updateMlModel(id: number, updates: Partial<InsertMlModel>): Promise<MlModel> {
    const model = this.mlModels.get(id);
    if (!model) throw new Error('ML Model not found');
    
    const updatedModel = { ...model, ...updates };
    this.mlModels.set(id, updatedModel);
    return updatedModel;
  }

  async deleteMlModel(id: number): Promise<void> {
    if (!this.mlModels.has(id)) throw new Error('ML Model not found');
    this.mlModels.delete(id);
  }

  // Integrations operations
  async getAllIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrationByPlatform(platform: string): Promise<Integration | undefined> {
    return Array.from(this.integrations.values()).find(integration => integration.platform === platform);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = this.currentId++;
    const integration: Integration = {
      ...insertIntegration,
      id,
      createdAt: new Date(),
      status: insertIntegration.status || "connected",
      apiKey: insertIntegration.apiKey || null,
      lastSync: insertIntegration.lastSync || null,
      syncFrequency: insertIntegration.syncFrequency || "daily",
      dataTypes: insertIntegration.dataTypes || null,
      configuration: insertIntegration.configuration || null
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: number, updates: Partial<InsertIntegration>): Promise<Integration> {
    const integration = this.integrations.get(id);
    if (!integration) throw new Error('Integration not found');
    
    const updatedIntegration = { ...integration, ...updates };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async deleteIntegration(id: number): Promise<void> {
    if (!this.integrations.has(id)) throw new Error('Integration not found');
    this.integrations.delete(id);
  }

  // Carbon Patterns operations
  async getAllCarbonPatterns(): Promise<CarbonPattern[]> {
    return Array.from(this.carbonPatterns.values());
  }

  async getCarbonPattern(id: number): Promise<CarbonPattern | undefined> {
    return this.carbonPatterns.get(id);
  }

  async getCarbonPatternsByType(patternType: string): Promise<CarbonPattern[]> {
    return Array.from(this.carbonPatterns.values()).filter(pattern => pattern.patternType === patternType);
  }

  async createCarbonPattern(insertPattern: InsertCarbonPattern): Promise<CarbonPattern> {
    const id = this.currentId++;
    const pattern: CarbonPattern = {
      ...insertPattern,
      id,
      createdAt: new Date(),
      confidence: insertPattern.confidence || null,
      frequency: insertPattern.frequency || null,
      factors: insertPattern.factors || null,
      recommendations: insertPattern.recommendations || null,
      companyId: insertPattern.companyId || null
    };
    this.carbonPatterns.set(id, pattern);
    return pattern;
  }

  async updateCarbonPattern(id: number, updates: Partial<InsertCarbonPattern>): Promise<CarbonPattern> {
    const pattern = this.carbonPatterns.get(id);
    if (!pattern) throw new Error('Carbon Pattern not found');
    
    const updatedPattern = { ...pattern, ...updates };
    this.carbonPatterns.set(id, updatedPattern);
    return updatedPattern;
  }

  async deleteCarbonPattern(id: number): Promise<void> {
    if (!this.carbonPatterns.has(id)) throw new Error('Carbon Pattern not found');
    this.carbonPatterns.delete(id);
  }

  // Australian Rating Systems implementations

  // Green Star operations
  async getGreenStarRatings(projectId?: number): Promise<GreenStarRating[]> {
    const ratings = Array.from(this.greenStarRatings.values());
    return projectId ? ratings.filter(r => r.projectId === projectId) : ratings;
  }

  async getGreenStarRating(id: number): Promise<GreenStarRating | undefined> {
    return this.greenStarRatings.get(id);
  }

  async createGreenStarRating(insertRating: InsertGreenStarRating): Promise<GreenStarRating> {
    const id = this.currentId++;
    const rating: GreenStarRating = {
      ...insertRating,
      projectId: insertRating.projectId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      certificationStatus: insertRating.certificationStatus || "in_progress",
      climatePositivePathway: insertRating.climatePositivePathway ?? false,
      registrationDate: insertRating.registrationDate || null,
      certificationDate: insertRating.certificationDate || null,
      expiryDate: insertRating.expiryDate || null,
      totalPoints: insertRating.totalPoints || null,
      maxPoints: insertRating.maxPoints || null,
      managementPoints: insertRating.managementPoints || null,
      indoorEnvironmentPoints: insertRating.indoorEnvironmentPoints || null,
      energyPoints: insertRating.energyPoints || null,
      transportPoints: insertRating.transportPoints || null,
      waterPoints: insertRating.waterPoints || null,
      materialsPoints: insertRating.materialsPoints || null,
      emissionsPoints: insertRating.emissionsPoints || null,
      landUsePoints: insertRating.landUsePoints || null,
      assessorName: insertRating.assessorName || null,
      assessorCompany: insertRating.assessorCompany || null,
      notes: insertRating.notes || null,
      targetRating: insertRating.targetRating || null,
      currentRating: insertRating.currentRating || null
    };
    this.greenStarRatings.set(id, rating);
    return rating;
  }

  async updateGreenStarRating(id: number, updates: Partial<InsertGreenStarRating>): Promise<GreenStarRating> {
    const rating = this.greenStarRatings.get(id);
    if (!rating) throw new Error('Green Star rating not found');
    
    const updatedRating = { 
      ...rating, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.greenStarRatings.set(id, updatedRating);
    return updatedRating;
  }

  async deleteGreenStarRating(id: number): Promise<void> {
    if (!this.greenStarRatings.has(id)) throw new Error('Green Star rating not found');
    this.greenStarRatings.delete(id);
  }

  // NABERS operations
  async getNabersRatings(projectId?: number): Promise<NabersRating[]> {
    const ratings = Array.from(this.nabersRatings.values());
    return projectId ? ratings.filter(r => r.projectId === projectId) : ratings;
  }

  async getNabersRating(id: number): Promise<NabersRating | undefined> {
    return this.nabersRatings.get(id);
  }

  async getNabersRatingsByType(ratingType: string): Promise<NabersRating[]> {
    return Array.from(this.nabersRatings.values()).filter(r => r.ratingType === ratingType);
  }

  async createNabersRating(insertRating: InsertNabersRating): Promise<NabersRating> {
    const id = this.currentId++;
    const rating: NabersRating = {
      ...insertRating,
      projectId: insertRating.projectId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      commitmentAgreement: insertRating.commitmentAgreement ?? false,
      currentRating: insertRating.currentRating || null,
      targetRating: insertRating.targetRating || null,
      benchmarkRating: insertRating.benchmarkRating || null,
      energyIntensity: insertRating.energyIntensity || null,
      waterConsumption: insertRating.waterConsumption || null,
      wasteGeneration: insertRating.wasteGeneration || null,
      recyclingRate: insertRating.recyclingRate || null,
      thermalComfort: insertRating.thermalComfort || null,
      airQuality: insertRating.airQuality || null,
      lightingQuality: insertRating.lightingQuality || null,
      acousticComfort: insertRating.acousticComfort || null,
      assessmentPeriod: insertRating.assessmentPeriod || null,
      certificationDate: insertRating.certificationDate || null,
      expiryDate: insertRating.expiryDate || null,
      assessorId: insertRating.assessorId || null,
      improvementTrend: insertRating.improvementTrend || null,
      previousRating: insertRating.previousRating || null,
      yearOverYearChange: insertRating.yearOverYearChange || null,
      notes: insertRating.notes || null
    };
    this.nabersRatings.set(id, rating);
    return rating;
  }

  async updateNabersRating(id: number, updates: Partial<InsertNabersRating>): Promise<NabersRating> {
    const rating = this.nabersRatings.get(id);
    if (!rating) throw new Error('NABERS rating not found');
    
    const updatedRating = { 
      ...rating, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.nabersRatings.set(id, updatedRating);
    return updatedRating;
  }

  async deleteNabersRating(id: number): Promise<void> {
    if (!this.nabersRatings.has(id)) throw new Error('NABERS rating not found');
    this.nabersRatings.delete(id);
  }

  // NCC Compliance operations
  async getNccCompliance(projectId?: number): Promise<NccCompliance[]> {
    const compliance = Array.from(this.nccCompliance.values());
    return projectId ? compliance.filter(c => c.projectId === projectId) : compliance;
  }

  async getNccComplianceByProject(projectId: number): Promise<NccCompliance | undefined> {
    return Array.from(this.nccCompliance.values()).find(c => c.projectId === projectId);
  }

  async createNccCompliance(insertCompliance: InsertNccCompliance): Promise<NccCompliance> {
    const id = this.currentId++;
    const compliance: NccCompliance = {
      ...insertCompliance,
      projectId: insertCompliance.projectId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      nccVersion: insertCompliance.nccVersion || "2022",
      j1p1Compliance: insertCompliance.j1p1Compliance ?? false,
      j1p2Compliance: insertCompliance.j1p2Compliance ?? false,
      j1p4Compliance: insertCompliance.j1p4Compliance ?? false,
      nabersCommitmentAgreement: insertCompliance.nabersCommitmentAgreement ?? false,
      renewableEnergyProvision: insertCompliance.renewableEnergyProvision ?? false,
      batteryProvision: insertCompliance.batteryProvision ?? false,
      evChargingProvision: insertCompliance.evChargingProvision ?? false,
      complianceStatus: insertCompliance.complianceStatus || "in_progress",
      requiredNabersRating: insertCompliance.requiredNabersRating || null,
      achievedNabersRating: insertCompliance.achievedNabersRating || null,
      heatingLoad: insertCompliance.heatingLoad || null,
      coolingLoad: insertCompliance.coolingLoad || null,
      thermalEnergyLoad: insertCompliance.thermalEnergyLoad || null,
      heatingLoadLimit: insertCompliance.heatingLoadLimit || null,
      coolingLoadLimit: insertCompliance.coolingLoadLimit || null,
      thermalEnergyLoadLimit: insertCompliance.thermalEnergyLoadLimit || null,
      baseGhgEmissions: insertCompliance.baseGhgEmissions || null,
      maxAllowedGhgEmissions: insertCompliance.maxAllowedGhgEmissions || null,
      actualGhgEmissions: insertCompliance.actualGhgEmissions || null,
      assessmentDate: insertCompliance.assessmentDate || null,
      complianceDate: insertCompliance.complianceDate || null,
      certifierName: insertCompliance.certifierName || null,
      certifierNumber: insertCompliance.certifierNumber || null,
      notes: insertCompliance.notes || null
    };
    this.nccCompliance.set(id, compliance);
    return compliance;
  }

  async updateNccCompliance(id: number, updates: Partial<InsertNccCompliance>): Promise<NccCompliance> {
    const compliance = this.nccCompliance.get(id);
    if (!compliance) throw new Error('NCC compliance record not found');
    
    const updatedCompliance = { 
      ...compliance, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.nccCompliance.set(id, updatedCompliance);
    return updatedCompliance;
  }

  async deleteNccCompliance(id: number): Promise<void> {
    if (!this.nccCompliance.has(id)) throw new Error('NCC compliance record not found');
    this.nccCompliance.delete(id);
  }

  // Rating Assessment operations
  async getRatingAssessments(projectId?: number): Promise<RatingAssessment[]> {
    const assessments = Array.from(this.ratingAssessments.values());
    return projectId ? assessments.filter(a => a.projectId === projectId) : assessments;
  }

  async getRatingAssessment(id: number): Promise<RatingAssessment | undefined> {
    return this.ratingAssessments.get(id);
  }

  async getRatingAssessmentsByType(assessmentType: string): Promise<RatingAssessment[]> {
    return Array.from(this.ratingAssessments.values()).filter(a => a.assessmentType === assessmentType);
  }

  async createRatingAssessment(insertAssessment: InsertRatingAssessment): Promise<RatingAssessment> {
    const id = this.currentId++;
    const assessment: RatingAssessment = {
      ...insertAssessment,
      projectId: insertAssessment.projectId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      overallProgress: insertAssessment.overallProgress ?? 0,
      status: insertAssessment.status || "scheduled",
      scheduledDate: insertAssessment.scheduledDate || null,
      completedDate: insertAssessment.completedDate || null,
      documentsRequired: insertAssessment.documentsRequired || null,
      documentsCompleted: insertAssessment.documentsCompleted || null,
      creditsTargeted: insertAssessment.creditsTargeted || null,
      creditsAchieved: insertAssessment.creditsAchieved || null,
      assessorContact: insertAssessment.assessorContact || null,
      estimatedCost: insertAssessment.estimatedCost || null,
      actualCost: insertAssessment.actualCost || null,
      nextMilestone: insertAssessment.nextMilestone || null,
      milestoneDueDate: insertAssessment.milestoneDueDate || null,
      outstandingIssues: insertAssessment.outstandingIssues || null,
      riskFactors: insertAssessment.riskFactors || null,
      recommendations: insertAssessment.recommendations || null,
      notes: insertAssessment.notes || null
    };
    this.ratingAssessments.set(id, assessment);
    return assessment;
  }

  async updateRatingAssessment(id: number, updates: Partial<InsertRatingAssessment>): Promise<RatingAssessment> {
    const assessment = this.ratingAssessments.get(id);
    if (!assessment) throw new Error('Rating assessment not found');
    
    const updatedAssessment = { 
      ...assessment, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.ratingAssessments.set(id, updatedAssessment);
    return updatedAssessment;
  }

  async deleteRatingAssessment(id: number): Promise<void> {
    if (!this.ratingAssessments.has(id)) throw new Error('Rating assessment not found');
    this.ratingAssessments.delete(id);
  }

  // Australian regulatory framework operations

  // State Building Regulations operations
  async getStateBuildingRegulations(state?: string): Promise<StateBuildingRegulation[]> {
    const regulations = Array.from(this.stateBuildingRegulations.values());
    return state ? regulations.filter(r => r.state === state) : regulations;
  }

  async getStateBuildingRegulation(id: number): Promise<StateBuildingRegulation | undefined> {
    return this.stateBuildingRegulations.get(id);
  }

  async getStateBuildingRegulationsByType(regulationType: string): Promise<StateBuildingRegulation[]> {
    return Array.from(this.stateBuildingRegulations.values()).filter(r => r.regulationType === regulationType);
  }

  async createStateBuildingRegulation(insertRegulation: InsertStateBuildingRegulation): Promise<StateBuildingRegulation> {
    const id = this.currentId++;
    const regulation: StateBuildingRegulation = {
      ...insertRegulation,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
      nextReview: insertRegulation.nextReview || null,
      keyProvisions: insertRegulation.keyProvisions || null,
      buildingClasses: insertRegulation.buildingClasses || null,
      energyEfficiencyStandards: insertRegulation.energyEfficiencyStandards || null,
      accessibilityRequirements: insertRegulation.accessibilityRequirements || null,
      transitionPeriod: insertRegulation.transitionPeriod || null,
      exemptions: insertRegulation.exemptions || null,
      complianceAuthority: insertRegulation.complianceAuthority || null,
      inspectionRequirements: insertRegulation.inspectionRequirements || null,
      penaltyStructure: insertRegulation.penaltyStructure || null,
      greenStarAlignment: insertRegulation.greenStarAlignment || null,
      nabersRequirements: insertRegulation.nabersRequirements || null,
      nccIntegration: insertRegulation.nccIntegration || null
    };
    this.stateBuildingRegulations.set(id, regulation);
    return regulation;
  }

  async updateStateBuildingRegulation(id: number, updates: Partial<InsertStateBuildingRegulation>): Promise<StateBuildingRegulation> {
    const regulation = this.stateBuildingRegulations.get(id);
    if (!regulation) throw new Error('State building regulation not found');
    
    const updatedRegulation = { 
      ...regulation, 
      ...updates, 
      lastUpdated: new Date() 
    };
    this.stateBuildingRegulations.set(id, updatedRegulation);
    return updatedRegulation;
  }

  async deleteStateBuildingRegulation(id: number): Promise<void> {
    if (!this.stateBuildingRegulations.has(id)) throw new Error('State building regulation not found');
    this.stateBuildingRegulations.delete(id);
  }

  // Federal Compliance Tracking operations (NGER & Safeguard)
  async getFederalComplianceTracking(projectId?: number): Promise<FederalComplianceTracking[]> {
    const compliance = Array.from(this.federalComplianceTracking.values());
    return projectId ? compliance.filter(c => c.projectId === projectId) : compliance;
  }

  async getFederalComplianceTrackingById(id: number): Promise<FederalComplianceTracking | undefined> {
    return this.federalComplianceTracking.get(id);
  }

  async getFederalComplianceByProject(projectId: number): Promise<FederalComplianceTracking | undefined> {
    return Array.from(this.federalComplianceTracking.values()).find(c => c.projectId === projectId);
  }

  async createFederalComplianceTracking(insertCompliance: InsertFederalComplianceTracking): Promise<FederalComplianceTracking> {
    const id = this.currentId++;
    const compliance: FederalComplianceTracking = {
      ...insertCompliance,
      projectId: insertCompliance.projectId ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAssessment: new Date(),
      facilityId: insertCompliance.facilityId || null,
      ngerThresholdStatus: insertCompliance.ngerThresholdStatus || null,
      estimatedAnnualEmissions: insertCompliance.estimatedAnnualEmissions || null,
      estimatedEnergyConsumption: insertCompliance.estimatedEnergyConsumption || null,
      ngerReportingDue: insertCompliance.ngerReportingDue || null,
      ngerComplianceStatus: insertCompliance.ngerComplianceStatus || "pending",
      safeguardThresholdStatus: insertCompliance.safeguardThresholdStatus || null,
      safeguardBaseline: insertCompliance.safeguardBaseline || null,
      currentEmissionsLevel: insertCompliance.currentEmissionsLevel || null,
      emissionsReductionRequired: insertCompliance.emissionsReductionRequired || null,
      acucBalance: insertCompliance.acucBalance || null,
      safeguardCredits: insertCompliance.safeguardCredits || null,
      overallComplianceScore: insertCompliance.overallComplianceScore || null,
      greenStarContribution: insertCompliance.greenStarContribution || null,
      nabersContribution: insertCompliance.nabersContribution || null,
      nccContribution: insertCompliance.nccContribution || null,
      nextReviewDue: insertCompliance.nextReviewDue || null
    };
    this.federalComplianceTracking.set(id, compliance);
    return compliance;
  }

  async updateFederalComplianceTracking(id: number, updates: Partial<InsertFederalComplianceTracking>): Promise<FederalComplianceTracking> {
    const compliance = this.federalComplianceTracking.get(id);
    if (!compliance) throw new Error('Federal compliance tracking not found');
    
    const updatedCompliance = { 
      ...compliance, 
      ...updates, 
      updatedAt: new Date(),
      lastAssessment: new Date()
    };
    this.federalComplianceTracking.set(id, updatedCompliance);
    return updatedCompliance;
  }

  async deleteFederalComplianceTracking(id: number): Promise<void> {
    if (!this.federalComplianceTracking.has(id)) throw new Error('Federal compliance tracking not found');
    this.federalComplianceTracking.delete(id);
  }
}

import { SupabaseStorage } from './supabase-storage';
import { isSupabaseConfigured } from './supabase';

// Create hybrid storage: use Supabase for supported tables, MemStorage for others
const memStorage = new MemStorage();
const supabaseStorage = new SupabaseStorage();

// Helper to gracefully fallback to MemStorage when Supabase is not configured
function withSupabaseFallback<T extends any[], R>(
  supabaseMethod: (...args: T) => Promise<R>,
  memStorageMethod: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    if (isSupabaseConfigured()) {
      try {
        return await supabaseMethod(...args);
      } catch (error) {
        console.warn('Supabase operation failed, falling back to MemStorage:', error);
        return await memStorageMethod(...args);
      }
    }
    return await memStorageMethod(...args);
  };
}

// Export a composite storage that uses Supabase where available, with graceful fallback
export const storage: IStorage = {
  // Use Supabase for projects with fallback to MemStorage
  getAllProjects: withSupabaseFallback(
    () => supabaseStorage.getAllProjects(),
    () => memStorage.getAllProjects()
  ),
  getProject: withSupabaseFallback(
    (id: number) => supabaseStorage.getProject(id),
    (id: number) => memStorage.getProject(id)
  ),
  createProject: withSupabaseFallback(
    (project: InsertProject) => supabaseStorage.createProject(project),
    (project: InsertProject) => memStorage.createProject(project)
  ),
  updateProject: withSupabaseFallback(
    (id: number, updates: Partial<InsertProject>) => supabaseStorage.updateProject(id, updates),
    (id: number, updates: Partial<InsertProject>) => memStorage.updateProject(id, updates)
  ),
  deleteProject: withSupabaseFallback(
    (id: number) => supabaseStorage.deleteProject(id),
    (id: number) => memStorage.deleteProject(id)
  ),

  // Use Supabase for carbon embodied data (unified_materials) with fallback
  getCarbonEmbodiedData: withSupabaseFallback(
    (projectId?: number) => supabaseStorage.getCarbonEmbodiedData(projectId),
    (projectId?: number) => memStorage.getCarbonEmbodiedData(projectId)
  ),
  createCarbonEmbodiedData: withSupabaseFallback(
    (data: InsertCarbonEmbodiedData) => supabaseStorage.createCarbonEmbodiedData(data),
    (data: InsertCarbonEmbodiedData) => memStorage.createCarbonEmbodiedData(data)
  ),
  updateCarbonEmbodiedData: withSupabaseFallback(
    (id: number, updates: Partial<InsertCarbonEmbodiedData>) => supabaseStorage.updateCarbonEmbodiedData(id, updates),
    (id: number, updates: Partial<InsertCarbonEmbodiedData>) => memStorage.updateCarbonEmbodiedData(id, updates)
  ),
  deleteCarbonEmbodiedData: withSupabaseFallback(
    (id: number) => supabaseStorage.deleteCarbonEmbodiedData(id),
    (id: number) => memStorage.deleteCarbonEmbodiedData(id)
  ),

  // Use MemStorage for all other operations (fallback)
  getUser: memStorage.getUser.bind(memStorage),
  upsertUser: memStorage.upsertUser.bind(memStorage),
  createUser: memStorage.createUser.bind(memStorage),
  updateUser: memStorage.updateUser.bind(memStorage),
  deleteUser: memStorage.deleteUser.bind(memStorage),

  getEmissionsByProject: memStorage.getEmissionsByProject.bind(memStorage),
  getAllEmissions: memStorage.getAllEmissions.bind(memStorage),
  createEmission: memStorage.createEmission.bind(memStorage),
  updateEmission: memStorage.updateEmission.bind(memStorage),
  deleteEmission: memStorage.deleteEmission.bind(memStorage),

  getAllRegulatoryAlerts: memStorage.getAllRegulatoryAlerts.bind(memStorage),
  getActiveRegulatoryAlerts: memStorage.getActiveRegulatoryAlerts.bind(memStorage),
  createRegulatoryAlert: memStorage.createRegulatoryAlert.bind(memStorage),
  updateRegulatoryAlert: memStorage.updateRegulatoryAlert.bind(memStorage),
  deleteRegulatoryAlert: memStorage.deleteRegulatoryAlert.bind(memStorage),

  getCarbonBudget: memStorage.getCarbonBudget.bind(memStorage),
  createCarbonBudget: memStorage.createCarbonBudget.bind(memStorage),
  updateCarbonBudget: memStorage.updateCarbonBudget.bind(memStorage),
  deleteCarbonBudget: memStorage.deleteCarbonBudget.bind(memStorage),

  getAllInvestments: memStorage.getAllInvestments.bind(memStorage),
  createInvestment: memStorage.createInvestment.bind(memStorage),
  updateInvestment: memStorage.updateInvestment.bind(memStorage),
  deleteInvestment: memStorage.deleteInvestment.bind(memStorage),

  getAllAiInsights: memStorage.getAllAiInsights.bind(memStorage),
  getActiveAiInsights: memStorage.getActiveAiInsights.bind(memStorage),
  createAiInsight: memStorage.createAiInsight.bind(memStorage),
  updateAiInsight: memStorage.updateAiInsight.bind(memStorage),
  deleteAiInsight: memStorage.deleteAiInsight.bind(memStorage),

  getLiveCarbonMetrics: memStorage.getLiveCarbonMetrics.bind(memStorage),
  createLiveCarbonMetric: memStorage.createLiveCarbonMetric.bind(memStorage),
  updateLiveCarbonMetric: memStorage.updateLiveCarbonMetric.bind(memStorage),
  deleteLiveCarbonMetric: memStorage.deleteLiveCarbonMetric.bind(memStorage),

  getCarbonReductionTactics: memStorage.getCarbonReductionTactics.bind(memStorage),
  createCarbonReductionTactic: memStorage.createCarbonReductionTactic.bind(memStorage),
  updateCarbonReductionTactic: memStorage.updateCarbonReductionTactic.bind(memStorage),
  deleteCarbonReductionTactic: memStorage.deleteCarbonReductionTactic.bind(memStorage),

  getAllMlModels: memStorage.getAllMlModels.bind(memStorage),
  getMlModel: memStorage.getMlModel.bind(memStorage),
  getMlModelsByType: memStorage.getMlModelsByType.bind(memStorage),
  createMlModel: memStorage.createMlModel.bind(memStorage),
  updateMlModel: memStorage.updateMlModel.bind(memStorage),
  deleteMlModel: memStorage.deleteMlModel.bind(memStorage),

  getAllIntegrations: memStorage.getAllIntegrations.bind(memStorage),
  getIntegration: memStorage.getIntegration.bind(memStorage),
  getIntegrationByPlatform: memStorage.getIntegrationByPlatform.bind(memStorage),
  createIntegration: memStorage.createIntegration.bind(memStorage),
  updateIntegration: memStorage.updateIntegration.bind(memStorage),
  deleteIntegration: memStorage.deleteIntegration.bind(memStorage),

  getAllCarbonPatterns: memStorage.getAllCarbonPatterns.bind(memStorage),
  getCarbonPattern: memStorage.getCarbonPattern.bind(memStorage),
  getCarbonPatternsByType: memStorage.getCarbonPatternsByType.bind(memStorage),
  createCarbonPattern: memStorage.createCarbonPattern.bind(memStorage),
  updateCarbonPattern: memStorage.updateCarbonPattern.bind(memStorage),
  deleteCarbonPattern: memStorage.deleteCarbonPattern.bind(memStorage),

  getGreenStarRatings: memStorage.getGreenStarRatings.bind(memStorage),
  getGreenStarRating: memStorage.getGreenStarRating.bind(memStorage),
  createGreenStarRating: memStorage.createGreenStarRating.bind(memStorage),
  updateGreenStarRating: memStorage.updateGreenStarRating.bind(memStorage),
  deleteGreenStarRating: memStorage.deleteGreenStarRating.bind(memStorage),

  getNabersRatings: memStorage.getNabersRatings.bind(memStorage),
  getNabersRating: memStorage.getNabersRating.bind(memStorage),
  getNabersRatingsByType: memStorage.getNabersRatingsByType.bind(memStorage),
  createNabersRating: memStorage.createNabersRating.bind(memStorage),
  updateNabersRating: memStorage.updateNabersRating.bind(memStorage),
  deleteNabersRating: memStorage.deleteNabersRating.bind(memStorage),

  getNccCompliance: memStorage.getNccCompliance.bind(memStorage),
  getNccComplianceByProject: memStorage.getNccComplianceByProject.bind(memStorage),
  createNccCompliance: memStorage.createNccCompliance.bind(memStorage),
  updateNccCompliance: memStorage.updateNccCompliance.bind(memStorage),
  deleteNccCompliance: memStorage.deleteNccCompliance.bind(memStorage),

  getRatingAssessments: memStorage.getRatingAssessments.bind(memStorage),
  getRatingAssessment: memStorage.getRatingAssessment.bind(memStorage),
  getRatingAssessmentsByType: memStorage.getRatingAssessmentsByType.bind(memStorage),
  createRatingAssessment: memStorage.createRatingAssessment.bind(memStorage),
  updateRatingAssessment: memStorage.updateRatingAssessment.bind(memStorage),
  deleteRatingAssessment: memStorage.deleteRatingAssessment.bind(memStorage),

  getStateBuildingRegulations: memStorage.getStateBuildingRegulations.bind(memStorage),
  getStateBuildingRegulation: memStorage.getStateBuildingRegulation.bind(memStorage),
  getStateBuildingRegulationsByType: memStorage.getStateBuildingRegulationsByType.bind(memStorage),
  createStateBuildingRegulation: memStorage.createStateBuildingRegulation.bind(memStorage),
  updateStateBuildingRegulation: memStorage.updateStateBuildingRegulation.bind(memStorage),
  deleteStateBuildingRegulation: memStorage.deleteStateBuildingRegulation.bind(memStorage),

  getFederalComplianceTracking: memStorage.getFederalComplianceTracking.bind(memStorage),
  getFederalComplianceTrackingById: memStorage.getFederalComplianceTrackingById.bind(memStorage),
  getFederalComplianceByProject: memStorage.getFederalComplianceByProject.bind(memStorage),
  createFederalComplianceTracking: memStorage.createFederalComplianceTracking.bind(memStorage),
  updateFederalComplianceTracking: memStorage.updateFederalComplianceTracking.bind(memStorage),
  deleteFederalComplianceTracking: memStorage.deleteFederalComplianceTracking.bind(memStorage)
};
