/**
 * Core Utilities Export
 *
 * Central export point for core Carbon Intelligence modules
 */

// @ts-ignore - JavaScript modules
import MaterialsDatabase from "../../../src/core/materials-database.js";
// @ts-ignore - JavaScript modules
import LCACalculator from "../../../src/core/lca-calculator.js";

// Initialize singleton instances with default configuration
let materialsDbInstance: any = null;
let lcaCalculatorInstance: any = null;

/**
 * Get or create Materials Database instance
 * @param {Object} options - Configuration options
 * @returns {MaterialsDatabase} Materials Database instance
 */
export const getMaterialsDatabase = (options = {}) => {
  if (!materialsDbInstance) {
    materialsDbInstance = new MaterialsDatabase({
      useEC3: true,
      preferAustralian: true,
      cacheResults: true,
      ...options,
    });
  }
  return materialsDbInstance;
};

/**
 * Get or create LCA Calculator instance
 * @param {Object} options - Configuration options
 * @returns {LCACalculator} LCA Calculator instance
 */
export const getLCACalculator = (options = {}) => {
  if (!lcaCalculatorInstance) {
    // Initialize with materials database
    const materialsDb = getMaterialsDatabase();

    lcaCalculatorInstance = new LCACalculator({
      projectLife: 50,
      includeSequestration: true,
      includeModule_D: true,
      australianContext: true,
      materialsDatabase: materialsDb,
      ...options,
    });
  }
  return lcaCalculatorInstance;
};

/**
 * Reset singleton instances (useful for testing or reconfiguration)
 */
export const resetInstances = () => {
  materialsDbInstance = null;
  lcaCalculatorInstance = null;
};

/**
 * Australian regions and states mapping
 */
export const australianRegions = {
  states: ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"],
  cities: {
    Sydney: { state: "nsw", gridFactor: 0.81 },
    Melbourne: { state: "vic", gridFactor: 1.02 },
    Brisbane: { state: "qld", gridFactor: 0.79 },
    Perth: { state: "wa", gridFactor: 0.7 },
    Adelaide: { state: "sa", gridFactor: 0.58 },
    Canberra: { state: "act", gridFactor: 0.81 },
    Hobart: { state: "tas", gridFactor: 0.18 },
    Darwin: { state: "nt", gridFactor: 0.58 },
  },
};

/**
 * Helper function to get material carbon data
 * @param category - Material category
 * @param type - Material type
 * @param context - Context (state, region, etc)
 * @returns Carbon coefficient data
 */
export const getMaterialCarbonData = async (
  category: string,
  type: string,
  context: any = {}
) => {
  const db = getMaterialsDatabase();
  return await db.getCarbonCoefficient(category, type, context);
};

/**
 * Helper function to calculate full LCA
 * @param material - Material object
 * @param quantity - Quantity
 * @param projectLife - Project lifespan
 * @param options - Additional options
 * @returns LCA results
 */
export const calculateMaterialLCA = (
  material: any,
  quantity: number,
  projectLife: number,
  options: any = {}
) => {
  const calculator = getLCACalculator();
  return calculator.calculateFullLCA(material, quantity, projectLife, options);
};

/**
 * Helper function to calculate LCA for multiple materials
 * @param materials - Array of material objects
 * @param projectLife - Project lifespan
 * @param options - Additional options
 * @returns Comprehensive LCA results
 */
export const calculateProjectLCA = (
  materials: any[],
  projectLife: number,
  options: any = {}
) => {
  const calculator = getLCACalculator();
  return calculator.calculateMaterialsLCA(materials, projectLife, options);
};

export default {
  getMaterialsDatabase,
  getLCACalculator,
  resetInstances,
  australianRegions,
  getMaterialCarbonData,
  calculateMaterialLCA,
  calculateProjectLCA,
};
