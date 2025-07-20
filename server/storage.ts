import {
  users, projects, emissions, regulatoryAlerts, carbonBudgets, investments, aiInsights,
  type User, type InsertUser, type Project, type InsertProject,
  type Emission, type InsertEmission, type RegulatoryAlert, type InsertRegulatoryAlert,
  type CarbonBudget, type InsertCarbonBudget, type Investment, type InsertInvestment,
  type AiInsight, type InsertAiInsight
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;

  // Emission operations
  getEmissionsByProject(projectId: number): Promise<Emission[]>;
  getAllEmissions(): Promise<Emission[]>;
  createEmission(emission: InsertEmission): Promise<Emission>;

  // Regulatory operations
  getAllRegulatoryAlerts(): Promise<RegulatoryAlert[]>;
  getActiveRegulatoryAlerts(): Promise<RegulatoryAlert[]>;
  createRegulatoryAlert(alert: InsertRegulatoryAlert): Promise<RegulatoryAlert>;
  updateRegulatoryAlert(id: number, updates: Partial<InsertRegulatoryAlert>): Promise<RegulatoryAlert>;

  // Carbon budget operations
  getCarbonBudget(year: number): Promise<CarbonBudget | undefined>;
  createCarbonBudget(budget: InsertCarbonBudget): Promise<CarbonBudget>;
  updateCarbonBudget(id: number, updates: Partial<InsertCarbonBudget>): Promise<CarbonBudget>;

  // Investment operations
  getAllInvestments(): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, updates: Partial<InsertInvestment>): Promise<Investment>;

  // AI insights operations
  getAllAiInsights(): Promise<AiInsight[]>;
  getActiveAiInsights(): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private emissions: Map<number, Emission>;
  private regulatoryAlerts: Map<number, RegulatoryAlert>;
  private carbonBudgets: Map<number, CarbonBudget>;
  private investments: Map<number, Investment>;
  private aiInsights: Map<number, AiInsight>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.emissions = new Map();
    this.regulatoryAlerts = new Map();
    this.carbonBudgets = new Map();
    this.investments = new Map();
    this.aiInsights = new Map();
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const project: Project = { ...insertProject, id, createdAt: new Date() };
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

  // Emission operations
  async getEmissionsByProject(projectId: number): Promise<Emission[]> {
    return Array.from(this.emissions.values()).filter(e => e.projectId === projectId);
  }

  async getAllEmissions(): Promise<Emission[]> {
    return Array.from(this.emissions.values());
  }

  async createEmission(insertEmission: InsertEmission): Promise<Emission> {
    const id = this.currentId++;
    const emission: Emission = { ...insertEmission, id };
    this.emissions.set(id, emission);
    return emission;
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
    const alert: RegulatoryAlert = { ...insertAlert, id, createdAt: new Date() };
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

  // Carbon budget operations
  async getCarbonBudget(year: number): Promise<CarbonBudget | undefined> {
    return Array.from(this.carbonBudgets.values()).find(budget => budget.year === year);
  }

  async createCarbonBudget(insertBudget: InsertCarbonBudget): Promise<CarbonBudget> {
    const id = this.currentId++;
    const budget: CarbonBudget = { ...insertBudget, id };
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

  // Investment operations
  async getAllInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.currentId++;
    const investment: Investment = { ...insertInvestment, id, createdAt: new Date() };
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

  // AI insights operations
  async getAllAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values());
  }

  async getActiveAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values()).filter(insight => insight.status === 'active');
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentId++;
    const insight: AiInsight = { ...insertInsight, id, createdAt: new Date() };
    this.aiInsights.set(id, insight);
    return insight;
  }
}

export const storage = new MemStorage();
