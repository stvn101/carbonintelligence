import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface PortfolioAnalysisResult {
  totalEmissions: number;
  emissionsByScope: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
  trends: {
    month: string;
    emissions: number;
  }[];
  insights: string[];
  recommendations: string[];
}

export interface OptimizationRecommendation {
  title: string;
  description: string;
  impact: string;
  priority: "high" | "medium" | "low";
  expectedReduction: number;
  cost: string;
  roi: string;
  category: string;
}

export interface InvestmentAnalysis {
  currentROI: number;
  projectedROI: number;
  opportunities: {
    name: string;
    investment: string;
    reduction: string;
    paybackPeriod: string;
    priority: number;
  }[];
}

export interface CarbonBudgetForecast {
  projectedConsumption: number;
  riskLevel: string;
  recommendations: string[];
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

export class OpenAIService {
  async analyzePortfolio(projectsData: any[], emissionsData: any[]): Promise<PortfolioAnalysisResult> {
    try {
      const prompt = `Analyze this carbon portfolio data and provide strategic insights:

Projects: ${JSON.stringify(projectsData)}
Emissions: ${JSON.stringify(emissionsData)}

Please analyze the data and respond with JSON in this format:
{
  "totalEmissions": number,
  "emissionsByScope": {
    "scope1": number,
    "scope2": number,
    "scope3": number
  },
  "trends": [
    {"month": "string", "emissions": number}
  ],
  "insights": ["string"],
  "recommendations": ["string"]
}

Focus on strategic insights for C-suite decision making.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a strategic carbon management consultant specializing in construction industry analysis. Provide data-driven insights and actionable recommendations for executives."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Portfolio analysis failed:", error);
      throw new Error("Failed to analyze portfolio data");
    }
  }

  async generateOptimizationRecommendations(
    projectsData: any[], 
    emissionsData: any[], 
    budgetData: any
  ): Promise<OptimizationRecommendation[]> {
    try {
      const prompt = `Generate optimization recommendations for this carbon portfolio:

Projects: ${JSON.stringify(projectsData)}
Emissions: ${JSON.stringify(emissionsData)}
Budget: ${JSON.stringify(budgetData)}

Provide strategic recommendations in JSON format as an array of objects with these fields:
- title: string
- description: string
- impact: string (specific reduction amount)
- priority: "high" | "medium" | "low"
- expectedReduction: number (tonnes CO2e)
- cost: string
- roi: string
- category: string

Focus on high-impact interventions for portfolio-wide emission reduction.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a carbon optimization expert specializing in construction portfolio management. Generate actionable, data-driven recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];
    } catch (error) {
      console.error("Optimization recommendations failed:", error);
      throw new Error("Failed to generate optimization recommendations");
    }
  }

  async analyzeInvestmentImpact(investmentData: any[], portfolioData: any[]): Promise<InvestmentAnalysis> {
    try {
      const prompt = `Analyze investment impact on carbon performance:

Investments: ${JSON.stringify(investmentData)}
Portfolio: ${JSON.stringify(portfolioData)}

Respond with JSON in this format:
{
  "currentROI": number,
  "projectedROI": number,
  "opportunities": [
    {
      "name": "string",
      "investment": "string",
      "reduction": "string",
      "paybackPeriod": "string",
      "priority": number
    }
  ]
}

Focus on ROI and strategic value of carbon reduction investments.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a sustainable investment analyst specializing in carbon ROI and portfolio optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Investment analysis failed:", error);
      throw new Error("Failed to analyze investment impact");
    }
  }

  async forecastCarbonBudget(
    budgetData: any, 
    currentConsumption: number, 
    projectsData: any[]
  ): Promise<CarbonBudgetForecast> {
    try {
      const prompt = `Forecast carbon budget performance:

Budget: ${JSON.stringify(budgetData)}
Current Consumption: ${currentConsumption}
Projects: ${JSON.stringify(projectsData)}

Respond with JSON in this format:
{
  "projectedConsumption": number,
  "riskLevel": "string",
  "recommendations": ["string"],
  "scenarios": {
    "optimistic": number,
    "realistic": number,
    "pessimistic": number
  }
}

Provide strategic forecast for remaining budget period.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a carbon budget analyst providing strategic forecasting for construction portfolios."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Carbon budget forecast failed:", error);
      throw new Error("Failed to forecast carbon budget");
    }
  }

  async processNaturalLanguageQuery(query: string, contextData: any): Promise<string> {
    try {
      const prompt = `Answer this strategic carbon management question using the provided context data:

Query: ${query}
Context: ${JSON.stringify(contextData)}

Provide a comprehensive, strategic response focused on actionable insights and recommendations for executives.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are CarbonIntelligence, a strategic carbon management assistant for construction executives. Provide clear, actionable insights and recommendations based on the data available."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });

      return response.choices[0].message.content || "Unable to process query";
    } catch (error) {
      console.error("Natural language query failed:", error);
      throw new Error("Failed to process query");
    }
  }
}

export const openaiService = new OpenAIService();
