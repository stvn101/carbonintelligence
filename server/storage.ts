import {
  users, projects, emissions, regulatoryAlerts, carbonBudgets, investments, aiInsights,
  carbonEmbodiedData, liveCarbonMetrics, carbonReductionTactics, mlModels, integrations, carbonPatterns,
  type User, type InsertUser, type Project, type InsertProject,
  type Emission, type InsertEmission, type RegulatoryAlert, type InsertRegulatoryAlert,
  type CarbonBudget, type InsertCarbonBudget, type Investment, type InsertInvestment,
  type AiInsight, type InsertAiInsight, type CarbonEmbodiedData, type InsertCarbonEmbodiedData,
  type LiveCarbonMetrics, type InsertLiveCarbonMetrics, type CarbonReductionTactics, type InsertCarbonReductionTactics,
  type MlModel, type InsertMlModel, type Integration, type InsertIntegration,
  type CarbonPattern, type InsertCarbonPattern
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
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

    // Create carbon embodied data for materials
    const materials = ["concrete", "steel", "aluminum", "timber", "glass"];
    materials.forEach((material, index) => {
      this.createCarbonEmbodiedData({
        materialType: material,
        materialSubtype: `structural_${material}`,
        quantity: (Math.random() * 100 + 50).toFixed(2),
        unit: material === "concrete" ? "m3" : "tonnes",
        embodiedCarbon: (Math.random() * 500 + 100).toFixed(3),
        totalEmbodiedCarbon: (Math.random() * 5000 + 1000).toFixed(2),
        supplier: `${material.charAt(0).toUpperCase()}${material.slice(1)} Corp`,
        transportDistance: (Math.random() * 500 + 50).toFixed(2),
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
        title: "Replace Standard Concrete with Low-Carbon Alternative",
        description: "Substitute 40% of Portland cement with fly ash and slag in concrete mix. This high-impact substitution reduces embodied carbon while maintaining structural integrity. Implement gradual replacement across non-critical applications first.",
        category: "material_substitution",
        applicablePhases: ["design", "procurement"],
        potentialReduction: "2847.5",
        reductionPercentage: "18.7",
        implementationCost: "125000",
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
        implementationCost: "75000",
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

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user" 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
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
      createdAt: new Date(),
      status: insertAlert.status || "active",
      effectiveDate: insertAlert.effectiveDate || null,
      deadline: insertAlert.deadline || null,
      affectedProjects: insertAlert.affectedProjects || null,
      source: insertAlert.source || null,
      impact: insertAlert.impact || null
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
}

export const storage = new MemStorage();
