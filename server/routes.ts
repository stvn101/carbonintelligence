import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { carbonConstructService } from "./services/carbonConstruct";
import { regulatoryService } from "./services/regulatory";
import { mlService } from "./services/mlService";
import { integrationsService } from "./services/integrations";
import { 
  insertProjectSchema, insertEmissionSchema, insertRegulatoryAlertSchema, insertInvestmentSchema,
  insertLiveCarbonMetricsSchema, insertMlModelSchema, insertIntegrationSchema 
} from "@shared/schema";
import { z } from "zod";

// Custom validation schemas for complex routes
const aiQuerySchema = z.object({
  query: z.string().min(1, "Query is required")
});

const complianceReportSchema = z.object({
  region: z.string().optional(),
  projectIds: z.array(z.number()).optional()
});

const mlForecastSchema = z.object({
  model: z.string().optional(),
  timeframe: z.string().min(1, "Timeframe is required")
});

const integrationSyncSchema = z.object({
  platform: z.string().min(1, "Platform is required")
});

const integrationConfigureSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  apiKey: z.string().min(1, "API key is required"),
  settings: z.record(z.any()).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard overview
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const emissions = await storage.getAllEmissions();
      const currentYear = new Date().getFullYear();
      const carbonBudget = await storage.getCarbonBudget(currentYear);
      const regulatoryAlerts = await storage.getActiveRegulatoryAlerts();

      // Calculate KPIs
      const totalEmissions = emissions.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const totalProjects = projects.length;
      const activeAlerts = regulatoryAlerts.length;
      
      // Calculate net zero progress (simplified)
      const targetDate = new Date("2030-01-01");
      const currentDate = new Date();
      const startDate = new Date("2020-01-01");
      const timeProgress = (currentDate.getTime() - startDate.getTime()) / (targetDate.getTime() - startDate.getTime());
      const netZeroProgress = Math.min(Math.round(timeProgress * 100), 100);

      res.json({
        totalEmissions: totalEmissions.toFixed(1),
        totalProjects,
        activeAlerts,
        netZeroProgress,
        savingsOpportunity: "A$1.2M", // Australian localized savings opportunity
        carbonBudget,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard overview" });
    }
  });

  // Portfolio analysis
  app.get("/api/portfolio/analysis", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const emissions = await storage.getAllEmissions();

      const analysis = await openaiService.analyzePortfolio(projects, emissions);
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze portfolio" });
    }
  });

  // Optimization recommendations
  app.get("/api/optimization/recommendations", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const emissions = await storage.getAllEmissions();
      const currentYear = new Date().getFullYear();
      const budget = await storage.getCarbonBudget(currentYear);

      const recommendations = await openaiService.generateOptimizationRecommendations(
        projects, 
        emissions, 
        budget
      );

      // Store insights in database
      for (const rec of recommendations.slice(0, 3)) { // Store top 3
        await storage.createAiInsight({
          type: "optimization",
          title: rec.title,
          content: rec.description,
          data: rec,
          confidence: "0.85",
          priority: rec.priority,
          status: "active"
        });
      }

      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate optimization recommendations" });
    }
  });

  // Regulatory intelligence
  app.get("/api/regulatory/alerts", async (req, res) => {
    try {
      const region = req.query.region as string;
      const updates = await regulatoryService.getLatestUpdates(region);
      
      // Store new alerts in database
      for (const update of updates) {
        const existing = await storage.getAllRegulatoryAlerts();
        const alreadyExists = existing.some(alert => alert.title === update.title);
        
        if (!alreadyExists) {
          await storage.createRegulatoryAlert({
            title: update.title,
            description: update.description,
            priority: update.priority,
            region: update.region,
            effectiveDate: new Date(update.effectiveDate),
            deadline: update.deadline ? new Date(update.deadline) : null,
            affectedProjects: null,
            status: "active",
            source: update.source,
            impact: update.impact
          });
        }
      }

      const allAlerts = await storage.getActiveRegulatoryAlerts();
      res.json({ alerts: allAlerts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regulatory alerts" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json({ project });
    } catch (error) {
      res.status(400).json({ error: "Failed to create project" });
    }
  });

  // Investment analysis
  app.get("/api/investments/analysis", async (req, res) => {
    try {
      const investments = await storage.getAllInvestments();
      const projects = await storage.getAllProjects();
      
      const analysis = await openaiService.analyzeInvestmentImpact(investments, projects);
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze investments" });
    }
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      res.status(201).json({ investment });
    } catch (error) {
      res.status(400).json({ error: "Failed to create investment" });
    }
  });

  // Carbon budget
  app.get("/api/carbon-budget/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const budget = await storage.getCarbonBudget(year);
      
      if (!budget) {
        return res.status(404).json({ error: "Carbon budget not found for year" });
      }

      const emissions = await storage.getAllEmissions();
      const projects = await storage.getAllProjects();
      const currentConsumption = emissions.reduce((sum, e) => sum + parseFloat(e.amount), 0);

      let forecast;
      try {
        forecast = await openaiService.forecastCarbonBudget(budget, currentConsumption, projects);
      } catch (openaiError) {
        console.log("OpenAI forecast unavailable, using fallback");
        forecast = {
          recommendations: [
            "Using Australian NGER methodology: Current trajectory shows potential budget overrun. Consider implementing Green Star certified optimizations to reduce emissions."
          ]
        };
      }
      
      res.json({ 
        budget: {
          ...budget,
          consumedBudget: currentConsumption.toString()
        },
        forecast 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carbon budget" });
    }
  });

  // AI chat
  app.post("/api/ai/query", async (req, res) => {
    try {
      const validatedData = aiQuerySchema.parse(req.body);
      const { query } = validatedData;

      // Gather context data
      const projects = await storage.getAllProjects();
      const emissions = await storage.getAllEmissions();
      const currentYear = new Date().getFullYear();
      const budget = await storage.getCarbonBudget(currentYear);
      const investments = await storage.getAllInvestments();
      const alerts = await storage.getActiveRegulatoryAlerts();

      const contextData = {
        projects,
        emissions,
        budget,
        investments,
        regulatoryAlerts: alerts,
        summary: {
          totalProjects: projects.length,
          totalEmissions: emissions.reduce((sum, e) => sum + parseFloat(e.amount), 0),
          activeAlerts: alerts.length
        }
      };

      const response = await openaiService.processNaturalLanguageQuery(query, contextData);
      
      res.json({ response });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to process AI query" });
    }
  });

  // CarbonConstruct integration
  app.get("/api/carbonconstruct/projects", async (req, res) => {
    try {
      const projects = await carbonConstructService.getProjects();
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CarbonConstruct projects" });
    }
  });

  app.get("/api/carbonconstruct/portfolio", async (req, res) => {
    try {
      const summary = await carbonConstructService.getPortfolioSummary();
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio summary" });
    }
  });

  // Compliance reporting
  app.post("/api/compliance/report", async (req, res) => {
    try {
      const validatedData = complianceReportSchema.parse(req.body);
      const { region, projectIds } = validatedData;
      
      const report = await regulatoryService.generateComplianceReport(projectIds || [], region || "Global");
      
      res.json({ report });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate compliance report" });
    }
  });

  // ML and AI routes
  app.get("/api/ml/insights", async (req, res) => {
    try {
      const emissions = await storage.getAllEmissions();
      const projects = await storage.getAllProjects();
      
      const forecasts = await mlService.forecastEmissions(emissions, "quarterly");
      
      res.json({
        forecasts: forecasts.predictions,
        modelAccuracy: forecasts.accuracy,
        trainingDataSize: emissions.length,
        companyModel: {
          status: "ready",
          accuracy: 0.94
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ML insights" });
    }
  });

  app.get("/api/ml/patterns", async (req, res) => {
    try {
      const emissions = await storage.getAllEmissions();
      const projects = await storage.getAllProjects();
      
      const patterns = await mlService.recognizePatterns(emissions, projects);
      
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze patterns" });
    }
  });

  app.post("/api/ml/forecast", async (req, res) => {
    try {
      const validatedData = mlForecastSchema.parse(req.body);
      const { model, timeframe } = validatedData;
      const emissions = await storage.getAllEmissions();
      
      const forecast = await mlService.forecastEmissions(emissions, timeframe, model === "company_specific");
      
      res.json(forecast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  app.post("/api/ml/train-company-model", async (req, res) => {
    try {
      const emissions = await storage.getAllEmissions();
      const projects = await storage.getAllProjects();
      
      const companyData = [...emissions, ...projects];
      const model = await mlService.trainCompanySpecificModel(companyData);
      
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: "Failed to train company model" });
    }
  });

  // Live Carbon Feed Routes
  app.get("/api/carbon/live-metrics", async (req, res) => {
    try {
      const { category } = req.query;
      const metrics = await storage.getLiveCarbonMetrics(category as string);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch live carbon metrics" });
    }
  });

  app.get("/api/carbon/embodied-breakdown", async (req, res) => {
    try {
      const embodiedData = await storage.getCarbonEmbodiedData();
      
      // Calculate breakdown by material type
      const breakdown = embodiedData.reduce((acc: any[], data) => {
        const existing = acc.find(item => item.materialType === data.materialType);
        const totalCarbon = parseFloat(data.totalEmbodiedCarbon);
        
        if (existing) {
          existing.totalEmbodiedCarbon = (parseFloat(existing.totalEmbodiedCarbon) + totalCarbon).toString();
        } else {
          acc.push({
            materialType: data.materialType,
            totalEmbodiedCarbon: data.totalEmbodiedCarbon,
            percentage: 0, // Will calculate after
            trend: Math.random() > 0.5 ? "up" : "down",
            change: `${(Math.random() * 10 - 5).toFixed(1)}%`
          });
        }
        return acc;
      }, []);

      // Calculate percentages
      const total = breakdown.reduce((sum, item) => sum + parseFloat(item.totalEmbodiedCarbon), 0);
      breakdown.forEach(item => {
        item.percentage = total > 0 ? (parseFloat(item.totalEmbodiedCarbon) / total) * 100 : 0;
      });

      res.json(breakdown);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch embodied carbon breakdown" });
    }
  });

  app.get("/api/carbon/reduction-tactics", async (req, res) => {
    try {
      const { priority } = req.query;
      const tactics = await storage.getCarbonReductionTactics(priority as string);
      res.json(tactics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carbon reduction tactics" });
    }
  });

  app.post("/api/carbon/live-metrics", async (req, res) => {
    try {
      const validatedData = insertLiveCarbonMetricsSchema.parse(req.body);
      const metric = await storage.createLiveCarbonMetric(validatedData);
      res.json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create live carbon metric" });
    }
  });

  // Integration routes
  app.get("/api/integrations/status", async (req, res) => {
    try {
      const platforms = await integrationsService.getIntegrationStatus();
      
      res.json({ platforms });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch integration status" });
    }
  });

  app.get("/api/integrations/sync-history", async (req, res) => {
    try {
      const history = [
        { platform: "Procore", status: "success", timestamp: "2 hours ago", records: 245 },
        { platform: "Autodesk", status: "success", timestamp: "4 hours ago", records: 189 },
        { platform: "Bluebeam", status: "error", timestamp: "3 days ago", records: 0 }
      ];
      
      res.json({ history });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sync history" });
    }
  });

  app.post("/api/integrations/sync", async (req, res) => {
    try {
      const validatedData = integrationSyncSchema.parse(req.body);
      const { platform } = validatedData;
      
      if (platform === "all") {
        const results = await integrationsService.syncAllPlatforms();
        res.json({ results });
      } else {
        let result;
        switch (platform) {
          case "procore":
            result = await integrationsService.syncProcore();
            break;
          case "autodesk":
            result = await integrationsService.syncAutodesk();
            break;
          case "bluebeam":
            result = await integrationsService.syncBluebeam();
            break;
          default:
            throw new Error("Unsupported platform");
        }
        res.json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to sync platform data" });
    }
  });

  app.post("/api/integrations/configure", async (req, res) => {
    try {
      const validatedData = integrationConfigureSchema.parse(req.body);
      const { platform, apiKey, settings } = validatedData;
      
      // In production, this would save encrypted API keys and settings
      res.json({ 
        success: true, 
        message: `${platform} integration configured successfully` 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to configure integration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
