// CarbonConstruct API integration service
// Based on research findings about carbon management SaaS APIs

export interface CarbonConstructProject {
  id: string;
  name: string;
  type: string;
  location: string;
  carbonFootprint: number;
  materials: any[];
  status: string;
  targetEmissions: number;
}

export interface CarbonConstructEmission {
  projectId: string;
  scope: string;
  category: string;
  amount: number;
  unit: string;
  date: string;
  source: string;
}

export interface MaterialEmissionFactor {
  material: string;
  emissionFactor: number;
  unit: string;
  region: string;
}

export class CarbonConstructService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CARBON_CONSTRUCT_API_KEY || process.env.API_KEY || "default_key";
    this.baseUrl = process.env.CARBON_CONSTRUCT_API_URL || "https://api.carbonconstruct.io/v1";
  }

  async getProjects(): Promise<CarbonConstructProject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error("Failed to fetch projects from CarbonConstruct:", error);
      return [];
    }
  }

  async getProjectEmissions(projectId: string): Promise<CarbonConstructEmission[]> {
    try {
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/emissions`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.emissions || [];
    } catch (error) {
      console.error(`Failed to fetch emissions for project ${projectId}:`, error);
      return [];
    }
  }

  async calculateEmissions(materials: any[], transportation: any[], energy: any[]): Promise<number> {
    try {
      const payload = {
        materials,
        transportation,
        energy
      };

      const response = await fetch(`${this.baseUrl}/calculate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Calculation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.totalEmissions || 0;
    } catch (error) {
      console.error("Failed to calculate emissions:", error);
      throw new Error("Carbon calculation service unavailable");
    }
  }

  async getMaterialEmissionFactors(region?: string): Promise<MaterialEmissionFactor[]> {
    try {
      const url = region 
        ? `${this.baseUrl}/emission-factors?region=${region}`
        : `${this.baseUrl}/emission-factors`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.emissionFactors || [];
    } catch (error) {
      console.error("Failed to fetch emission factors:", error);
      return [];
    }
  }

  async createProject(projectData: Partial<CarbonConstructProject>): Promise<CarbonConstructProject | null> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`Project creation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.project || null;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw new Error("Project creation service unavailable");
    }
  }

  async getPortfolioSummary(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/summary`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.summary || {};
    } catch (error) {
      console.error("Failed to fetch portfolio summary:", error);
      return {
        totalProjects: 0,
        totalEmissions: 0,
        averageReduction: 0,
        status: "unavailable"
      };
    }
  }
}

export const carbonConstructService = new CarbonConstructService();
