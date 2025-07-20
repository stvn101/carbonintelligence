import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // commercial, residential, mixed-use
  location: text("location").notNull(),
  status: text("status").notNull(), // planning, in-progress, completed
  carbonFootprint: decimal("carbon_footprint", { precision: 10, scale: 2 }).notNull(),
  targetEmissions: decimal("target_emissions", { precision: 10, scale: 2 }).notNull(),
  progress: integer("progress").notNull().default(0), // percentage
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  materials: jsonb("materials"), // JSON array of materials used
  energyConsumption: decimal("energy_consumption", { precision: 10, scale: 2 }),
  transportationEmissions: decimal("transportation_emissions", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emissions = pgTable("emissions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  scope: text("scope").notNull(), // scope1, scope2, scope3
  category: text("category").notNull(), // materials, transportation, energy, etc.
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default("tCO2e"),
  date: timestamp("date").notNull(),
  source: text("source"), // data source/calculation method
  verified: boolean("verified").default(false),
});

export const regulatoryAlerts = pgTable("regulatory_alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  region: text("region").notNull(),
  effectiveDate: timestamp("effective_date"),
  deadline: timestamp("deadline"),
  affectedProjects: jsonb("affected_projects"), // array of project IDs
  status: text("status").notNull().default("active"), // active, resolved, dismissed
  source: text("source"), // regulation source
  impact: text("impact"), // compliance requirements, cost impact, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonBudgets = pgTable("carbon_budgets", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  allocatedBudget: decimal("allocated_budget", { precision: 10, scale: 2 }).notNull(),
  consumedBudget: decimal("consumed_budget", { precision: 10, scale: 2 }).notNull(),
  categories: jsonb("categories"), // budget allocation by category
  projects: jsonb("projects"), // budget allocation by project
  status: text("status").notNull().default("active"),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expectedReduction: decimal("expected_reduction", { precision: 10, scale: 2 }).notNull(),
  paybackPeriod: integer("payback_period"), // months
  roi: decimal("roi", { precision: 5, scale: 2 }), // percentage
  status: text("status").notNull().default("proposed"), // proposed, approved, implemented
  category: text("category").notNull(), // materials, energy, technology, etc.
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // optimization, forecast, recommendation, pattern, anomaly
  title: text("title").notNull(),
  content: text("content").notNull(),
  data: jsonb("data"), // structured insight data
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0-1
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("active"),
  modelVersion: text("model_version"), // track ML model versions
  accuracy: decimal("accuracy", { precision: 3, scale: 2 }), // model accuracy
  createdAt: timestamp("created_at").defaultNow(),
});

export const mlModels = pgTable("ml_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // forecasting, classification, optimization
  version: text("version").notNull(),
  accuracy: decimal("accuracy", { precision: 3, scale: 2 }),
  trainingData: jsonb("training_data"), // metadata about training dataset
  hyperparameters: jsonb("hyperparameters"),
  status: text("status").notNull().default("active"), // active, deprecated, training
  companySpecific: boolean("company_specific").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastTrained: timestamp("last_trained"),
});

export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // procore, autodesk, bluebeam, etc.
  status: text("status").notNull().default("connected"), // connected, disconnected, error
  apiKey: text("api_key"), // encrypted storage
  lastSync: timestamp("last_sync"),
  syncFrequency: text("sync_frequency").default("daily"), // hourly, daily, weekly
  dataTypes: jsonb("data_types"), // what data types are synced
  configuration: jsonb("configuration"), // platform-specific settings
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonPatterns = pgTable("carbon_patterns", {
  id: serial("id").primaryKey(),
  patternType: text("pattern_type").notNull(), // seasonal, material_usage, efficiency
  description: text("description").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  impact: text("impact").notNull(), // high, medium, low
  frequency: text("frequency"), // daily, weekly, monthly, quarterly
  factors: jsonb("factors"), // contributing factors
  recommendations: jsonb("recommendations"),
  companyId: integer("company_id"), // for company-specific patterns
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertEmissionSchema = createInsertSchema(emissions).omit({ id: true });
export const insertRegulatoryAlertSchema = createInsertSchema(regulatoryAlerts).omit({ id: true, createdAt: true });
export const insertCarbonBudgetSchema = createInsertSchema(carbonBudgets).omit({ id: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true, createdAt: true });
export const insertMlModelSchema = createInsertSchema(mlModels).omit({ id: true, createdAt: true });
export const insertIntegrationSchema = createInsertSchema(integrations).omit({ id: true, createdAt: true });
export const insertCarbonPatternSchema = createInsertSchema(carbonPatterns).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Emission = typeof emissions.$inferSelect;
export type InsertEmission = z.infer<typeof insertEmissionSchema>;
export type RegulatoryAlert = typeof regulatoryAlerts.$inferSelect;
export type InsertRegulatoryAlert = z.infer<typeof insertRegulatoryAlertSchema>;
export type CarbonBudget = typeof carbonBudgets.$inferSelect;
export type InsertCarbonBudget = z.infer<typeof insertCarbonBudgetSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type MlModel = typeof mlModels.$inferSelect;
export type InsertMlModel = z.infer<typeof insertMlModelSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type CarbonPattern = typeof carbonPatterns.$inferSelect;
export type InsertCarbonPattern = z.infer<typeof insertCarbonPatternSchema>;
