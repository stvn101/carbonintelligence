import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  
  // Australian regulatory framework fields
  regulatoryFramework: text("regulatory_framework"), // NGER, Safeguard, StateBuilding, NCC
  jurisdiction: text("jurisdiction"), // Federal, NSW, VIC, QLD, WA, SA, TAS, NT, ACT
  legislativeInstrument: text("legislative_instrument"), // Act, Regulation, Standard, Code
  complianceThresholds: jsonb("compliance_thresholds"), // emission thresholds, building class requirements
  reportingRequirements: jsonb("reporting_requirements"), // NGER submission dates, safeguard baseline requirements
  penaltyFramework: jsonb("penalty_framework"), // penalty units, financial penalties
  
  // Compliance scoring reference to Australian rating systems  
  relatedGreenStarCategories: jsonb("related_green_star_categories"), // which Green Star categories affected
  relatedNabersMetrics: jsonb("related_nabers_metrics"), // which NABERS metrics affected
  relatedNccSections: jsonb("related_ncc_sections"), // which NCC sections affected
  complianceScore: decimal("compliance_score", { precision: 3, scale: 2 }), // 0-1 score based on Australian frameworks
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Australian state-based building regulations monitoring
export const stateBuildingRegulations = pgTable("state_building_regulations", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(), // NSW, VIC, QLD, WA, SA, TAS, NT, ACT
  regulationTitle: text("regulation_title").notNull(),
  regulationType: text("regulation_type").notNull(), // Building Code, Energy Efficiency, Accessibility, Safety
  legislativeReference: text("legislative_reference").notNull(), // Act and regulation reference
  currentVersion: text("current_version").notNull(),
  
  // Key provisions
  keyProvisions: jsonb("key_provisions"), // major requirements and changes
  buildingClasses: jsonb("building_classes"), // which building classes affected (Class 1a, 2, 3, 5, etc.)
  energyEfficiencyStandards: jsonb("energy_efficiency_standards"), // star ratings, performance requirements
  accessibilityRequirements: jsonb("accessibility_requirements"), // liveable housing, DDA compliance
  
  // Implementation details
  effectiveDate: timestamp("effective_date").notNull(),
  transitionPeriod: text("transition_period"), // grace periods, phased implementation
  exemptions: jsonb("exemptions"), // building types or circumstances exempt
  
  // Compliance and monitoring
  complianceAuthority: text("compliance_authority"), // state authority responsible
  inspectionRequirements: jsonb("inspection_requirements"), // mandatory inspections, certifications
  penaltyStructure: jsonb("penalty_structure"), // fines, penalties for non-compliance
  
  // Integration with rating systems
  greenStarAlignment: jsonb("green_star_alignment"), // how regulations align with Green Star
  nabersRequirements: jsonb("nabers_requirements"), // mandatory NABERS ratings by building class
  nccIntegration: jsonb("ncc_integration"), // state variations to NCC
  
  lastUpdated: timestamp("last_updated").defaultNow(),
  nextReview: timestamp("next_review"), // scheduled regulatory review dates
  createdAt: timestamp("created_at").defaultNow(),
});

// NGER and Safeguard Mechanism compliance tracking
export const federalComplianceTracking = pgTable("federal_compliance_tracking", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  facilityId: text("facility_id"), // government assigned facility ID
  
  // NGER compliance
  ngerThresholdStatus: text("nger_threshold_status"), // below_threshold, facility_level, corporate_level
  estimatedAnnualEmissions: decimal("estimated_annual_emissions", { precision: 10, scale: 2 }), // tonnes CO2e
  estimatedEnergyConsumption: decimal("estimated_energy_consumption", { precision: 10, scale: 2 }), // TJ
  ngerReportingDue: timestamp("nger_reporting_due"), // October 31 annually
  ngerComplianceStatus: text("nger_compliance_status").default("pending"), // compliant, non_compliant, pending
  
  // Safeguard Mechanism compliance  
  safeguardThresholdStatus: text("safeguard_threshold_status"), // below_threshold, covered_facility
  safeguardBaseline: decimal("safeguard_baseline", { precision: 10, scale: 2 }), // tonnes CO2e baseline
  currentEmissionsLevel: decimal("current_emissions_level", { precision: 10, scale: 2 }),
  emissionsReductionRequired: decimal("emissions_reduction_required", { precision: 10, scale: 2 }),
  acucBalance: decimal("acuc_balance", { precision: 10, scale: 2 }), // Australian Carbon Credit Units
  safeguardCredits: decimal("safeguard_credits", { precision: 10, scale: 2 }),
  
  // Compliance scoring based on Australian frameworks
  overallComplianceScore: decimal("overall_compliance_score", { precision: 3, scale: 2 }), // 0-1
  greenStarContribution: decimal("green_star_contribution", { precision: 3, scale: 2 }), // weight in scoring
  nabersContribution: decimal("nabers_contribution", { precision: 3, scale: 2 }),
  nccContribution: decimal("ncc_contribution", { precision: 3, scale: 2 }),
  
  lastAssessment: timestamp("last_assessment").defaultNow(),
  nextReviewDue: timestamp("next_review_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Real-time carbon embodied tracking
export const carbonEmbodiedData = pgTable("carbon_embodied_data", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  materialType: text("material_type").notNull(), // concrete, steel, aluminum, timber, etc.
  materialSubtype: text("material_subtype"), // reinforced_concrete, structural_steel, etc.
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // kg, m3, tonnes, etc.
  embodiedCarbon: decimal("embodied_carbon", { precision: 10, scale: 3 }).notNull(), // kgCO2e per unit
  totalEmbodiedCarbon: decimal("total_embodied_carbon", { precision: 10, scale: 2 }).notNull(),
  supplier: text("supplier"),
  certifications: jsonb("certifications"), // EPD, BREEAM, LEED, etc.
  transportDistance: decimal("transport_distance", { precision: 8, scale: 2 }),
  transportMode: text("transport_mode"), // truck, rail, ship
  transportEmissions: decimal("transport_emissions", { precision: 10, scale: 2 }),
  wastePercentage: decimal("waste_percentage", { precision: 5, scale: 2 }),
  recycledContent: decimal("recycled_content", { precision: 5, scale: 2 }),
  endOfLifeScenario: text("end_of_life_scenario"), // recycle, landfill, incineration
  installationDate: timestamp("installation_date"),
  dataSource: text("data_source").notNull(), // manual, api, sensor, integration
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // data quality score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Live carbon metrics for real-time monitoring
export const liveCarbonMetrics = pgTable("live_carbon_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // embodied, operational, transport, total
  value: decimal("value", { precision: 12, scale: 3 }).notNull(),
  unit: text("unit").notNull().default("tCO2e"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  projectId: integer("project_id").references(() => projects.id),
  category: text("category"), // materials, energy, transport, waste
  subcategory: text("subcategory"),
  benchmark: decimal("benchmark", { precision: 12, scale: 3 }), // industry benchmark
  target: decimal("target", { precision: 12, scale: 3 }), // target value
  trend: text("trend"), // increasing, decreasing, stable
  changeFromPrevious: decimal("change_from_previous", { precision: 8, scale: 3 }),
  alerts: jsonb("alerts"), // threshold alerts, anomalies
});

// Carbon reduction tactics and recommendations
export const carbonReductionTactics = pgTable("carbon_reduction_tactics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // material_substitution, design_optimization, transport, etc.
  applicablePhases: jsonb("applicable_phases"), // design, procurement, construction, operation
  potentialReduction: decimal("potential_reduction", { precision: 10, scale: 2 }), // tCO2e
  reductionPercentage: decimal("reduction_percentage", { precision: 5, scale: 2 }), // %
  implementationCost: decimal("implementation_cost", { precision: 10, scale: 2 }),
  paybackPeriod: integer("payback_period"), // months
  feasibilityScore: decimal("feasibility_score", { precision: 3, scale: 2 }), // 0-1
  priority: text("priority").notNull(), // critical, high, medium, low
  implementationComplexity: text("implementation_complexity"), // low, medium, high
  requiredResources: jsonb("required_resources"),
  timeline: text("timeline"), // immediate, short_term, medium_term, long_term
  materialTypes: jsonb("material_types"), // applicable material types
  projectTypes: jsonb("project_types"), // applicable project types
  evidenceBase: text("evidence_base"), // case_study, research, expert_opinion
  successMetrics: jsonb("success_metrics"),
  risks: jsonb("risks"),
  dependencies: jsonb("dependencies"),
  source: text("source"), // ai_generated, expert_input, literature
  aiConfidence: decimal("ai_confidence", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Australian Rating Systems

// Green Star certifications and assessments
export const greenStarRatings = pgTable("green_star_ratings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  toolType: text("tool_type").notNull(), // Buildings, Performance, Communities, Fitouts
  toolVersion: text("tool_version").notNull(), // v1.1, v2, etc.
  targetRating: integer("target_rating"), // 1-6 stars
  currentRating: integer("current_rating"), // achieved rating
  certificationStatus: text("certification_status").notNull().default("in_progress"), // planning, in_progress, certified, expired
  registrationDate: timestamp("registration_date"),
  certificationDate: timestamp("certification_date"),
  expiryDate: timestamp("expiry_date"),
  totalPoints: integer("total_points"),
  maxPoints: integer("max_points"),
  
  // Category scores
  managementPoints: integer("management_points"),
  indoorEnvironmentPoints: integer("indoor_environment_points"),
  energyPoints: integer("energy_points"),
  transportPoints: integer("transport_points"),
  waterPoints: integer("water_points"),
  materialsPoints: integer("materials_points"),
  emissionsPoints: integer("emissions_points"),
  landUsePoints: integer("land_use_points"),
  
  climatePositivePathway: boolean("climate_positive_pathway").default(false),
  assessorName: text("assessor_name"),
  assessorCompany: text("assessor_company"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NABERS performance ratings and metrics
export const nabersRatings = pgTable("nabers_ratings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  buildingType: text("building_type").notNull(), // Office, Hotel, Shopping Centre, Apartment, etc.
  ratingType: text("rating_type").notNull(), // Energy, Water, Waste, Indoor Environment
  currentRating: decimal("current_rating", { precision: 2, scale: 1 }), // 0.0-6.0
  targetRating: decimal("target_rating", { precision: 2, scale: 1 }),
  benchmarkRating: decimal("benchmark_rating", { precision: 2, scale: 1 }), // market average
  
  // Performance metrics
  energyIntensity: decimal("energy_intensity", { precision: 10, scale: 2 }), // MJ/m²/year or similar
  waterConsumption: decimal("water_consumption", { precision: 10, scale: 2 }), // L/m²/year
  wasteGeneration: decimal("waste_generation", { precision: 10, scale: 2 }), // kg/m²/year
  recyclingRate: decimal("recycling_rate", { precision: 5, scale: 2 }), // percentage
  
  // Indoor environment metrics
  thermalComfort: decimal("thermal_comfort", { precision: 3, scale: 1 }), // PMV score
  airQuality: decimal("air_quality", { precision: 5, scale: 2 }), // various metrics
  lightingQuality: decimal("lighting_quality", { precision: 5, scale: 2 }),
  acousticComfort: decimal("acoustic_comfort", { precision: 5, scale: 2 }),
  
  assessmentPeriod: text("assessment_period"), // 12-month period
  commitmentAgreement: boolean("commitment_agreement").default(false),
  certificationDate: timestamp("certification_date"),
  expiryDate: timestamp("expiry_date"),
  assessorId: text("assessor_id"),
  
  // Performance tracking
  improvementTrend: text("improvement_trend"), // improving, stable, declining
  previousRating: decimal("previous_rating", { precision: 2, scale: 1 }),
  yearOverYearChange: decimal("year_over_year_change", { precision: 3, scale: 2 }),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NCC Section J compliance tracking
export const nccCompliance = pgTable("ncc_compliance", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  nccVersion: text("ncc_version").notNull().default("2022"), // NCC 2022, etc.
  buildingClass: text("building_class").notNull(), // Class 2, 3, 5, 6, etc.
  state: text("state").notNull(), // NSW, VIC, QLD, etc.
  
  // Section J Performance Requirements
  j1p1Compliance: boolean("j1p1_compliance").default(false), // Energy efficiency
  j1p2Compliance: boolean("j1p2_compliance").default(false), // Thermal performance (Class 2/4)
  j1p4Compliance: boolean("j1p4_compliance").default(false), // Distributed energy resources
  
  // NABERS requirements by building class
  requiredNabersRating: decimal("required_nabers_rating", { precision: 2, scale: 1 }), // Class 5: 5.5, Class 3: 4.0, Class 6: 4.5
  achievedNabersRating: decimal("achieved_nabers_rating", { precision: 2, scale: 1 }),
  nabersCommitmentAgreement: boolean("nabers_commitment_agreement").default(false),
  
  // Thermal performance metrics
  heatingLoad: decimal("heating_load", { precision: 10, scale: 2 }), // MJ/m²/year
  coolingLoad: decimal("cooling_load", { precision: 10, scale: 2 }),
  thermalEnergyLoad: decimal("thermal_energy_load", { precision: 10, scale: 2 }),
  heatingLoadLimit: decimal("heating_load_limit", { precision: 10, scale: 2 }),
  coolingLoadLimit: decimal("cooling_load_limit", { precision: 10, scale: 2 }),
  thermalEnergyLoadLimit: decimal("thermal_energy_load_limit", { precision: 10, scale: 2 }),
  
  // Distributed energy provisions
  renewableEnergyProvision: boolean("renewable_energy_provision").default(false),
  batteryProvision: boolean("battery_provision").default(false),
  evChargingProvision: boolean("ev_charging_provision").default(false),
  
  // Greenhouse gas emissions
  baseGhgEmissions: decimal("base_ghg_emissions", { precision: 10, scale: 2 }), // tCO2e/year
  maxAllowedGhgEmissions: decimal("max_allowed_ghg_emissions", { precision: 10, scale: 2 }), // 67% of 5.5-star level
  actualGhgEmissions: decimal("actual_ghg_emissions", { precision: 10, scale: 2 }),
  
  complianceStatus: text("compliance_status").notNull().default("in_progress"), // compliant, non_compliant, in_progress
  assessmentDate: timestamp("assessment_date"),
  complianceDate: timestamp("compliance_date"),
  certifierName: text("certifier_name"),
  certifierNumber: text("certifier_number"),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rating assessment history and progress tracking
export const ratingAssessments = pgTable("rating_assessments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  assessmentType: text("assessment_type").notNull(), // green_star, nabers, ncc
  assessmentStage: text("assessment_stage").notNull(), // design, construction, operation, renewal
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  
  // Progress tracking
  overallProgress: integer("overall_progress").default(0), // percentage 0-100
  documentsRequired: integer("documents_required"),
  documentsCompleted: integer("documents_completed"),
  creditsTargeted: integer("credits_targeted"),
  creditsAchieved: integer("credits_achieved"),
  
  // Assessment details
  assessorContact: text("assessor_contact"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  nextMilestone: text("next_milestone"),
  milestoneDueDate: timestamp("milestone_due_date"),
  
  // Issues and risks
  outstandingIssues: jsonb("outstanding_issues"),
  riskFactors: jsonb("risk_factors"),
  recommendations: jsonb("recommendations"),
  
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, on_hold
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const upsertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertEmissionSchema = createInsertSchema(emissions).omit({ id: true });
export const insertRegulatoryAlertSchema = createInsertSchema(regulatoryAlerts).omit({ id: true, createdAt: true });
export const insertCarbonBudgetSchema = createInsertSchema(carbonBudgets).omit({ id: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true, createdAt: true });
export const insertMlModelSchema = createInsertSchema(mlModels).omit({ id: true, createdAt: true });
export const insertIntegrationSchema = createInsertSchema(integrations).omit({ id: true, createdAt: true });
export const insertCarbonPatternSchema = createInsertSchema(carbonPatterns).omit({ id: true, createdAt: true });
export const insertCarbonEmbodiedDataSchema = createInsertSchema(carbonEmbodiedData).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLiveCarbonMetricsSchema = createInsertSchema(liveCarbonMetrics).omit({ id: true });
export const insertCarbonReductionTacticsSchema = createInsertSchema(carbonReductionTactics).omit({ id: true, createdAt: true, updatedAt: true });

// Australian rating system insert schemas
export const insertGreenStarRatingSchema = createInsertSchema(greenStarRatings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNabersRatingSchema = createInsertSchema(nabersRatings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNccComplianceSchema = createInsertSchema(nccCompliance).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRatingAssessmentSchema = createInsertSchema(ratingAssessments).omit({ id: true, createdAt: true, updatedAt: true });

// Australian regulatory framework insert schemas
export const insertStateBuildingRegulationSchema = createInsertSchema(stateBuildingRegulations).omit({ id: true, createdAt: true, lastUpdated: true });
export const insertFederalComplianceTrackingSchema = createInsertSchema(federalComplianceTracking).omit({ id: true, createdAt: true, updatedAt: true, lastAssessment: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
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
export type CarbonEmbodiedData = typeof carbonEmbodiedData.$inferSelect;
export type InsertCarbonEmbodiedData = z.infer<typeof insertCarbonEmbodiedDataSchema>;
export type LiveCarbonMetrics = typeof liveCarbonMetrics.$inferSelect;
export type InsertLiveCarbonMetrics = z.infer<typeof insertLiveCarbonMetricsSchema>;
export type CarbonReductionTactics = typeof carbonReductionTactics.$inferSelect;
export type InsertCarbonReductionTactics = z.infer<typeof insertCarbonReductionTacticsSchema>;

// Australian rating system types
export type GreenStarRating = typeof greenStarRatings.$inferSelect;
export type InsertGreenStarRating = z.infer<typeof insertGreenStarRatingSchema>;
export type NabersRating = typeof nabersRatings.$inferSelect;
export type InsertNabersRating = z.infer<typeof insertNabersRatingSchema>;
export type NccCompliance = typeof nccCompliance.$inferSelect;
export type InsertNccCompliance = z.infer<typeof insertNccComplianceSchema>;
export type RatingAssessment = typeof ratingAssessments.$inferSelect;
export type InsertRatingAssessment = z.infer<typeof insertRatingAssessmentSchema>;

// Australian regulatory framework types
export type StateBuildingRegulation = typeof stateBuildingRegulations.$inferSelect;
export type InsertStateBuildingRegulation = z.infer<typeof insertStateBuildingRegulationSchema>;
export type FederalComplianceTracking = typeof federalComplianceTracking.$inferSelect;
export type InsertFederalComplianceTracking = z.infer<typeof insertFederalComplianceTrackingSchema>;
