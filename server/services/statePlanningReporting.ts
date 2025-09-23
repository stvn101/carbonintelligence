// State Planning Authority Submission Formats
// NSW and VIC sustainability requirements and submission generators

export interface StateSubmissionData {
  projectDetails: {
    projectId: string;
    projectName: string;
    projectType: "residential" | "commercial" | "mixed_use" | "industrial" | "infrastructure";
    developmentValue: number; // AUD
    floorArea: number; // m²
    buildingHeight: number; // m
    numberOfUnits?: number;
    
    location: {
      address: string;
      suburb: string;
      postcode: string;
      state: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    
    applicant: {
      name: string;
      company: string;
      abn: string;
      address: string;
      contactPerson: string;
      phone: string;
      email: string;
    };
  };
  
  sustainabilityAssessment: {
    energyEfficiency: {
      basixRating?: number; // NSW specific
      starRating?: number; // NatHERS
      greenStarRating?: number;
      nabersCommitment?: number;
      energyConsumptionTarget: number; // kWh/m²/year
    };
    
    waterEfficiency: {
      waterEfficiencyRating?: number;
      rainwaterHarvesting: boolean;
      greyWaterRecycling: boolean;
      waterSensitiveUrbanDesign: boolean;
      targetReduction: number; // percentage
    };
    
    carbonImpact: {
      embodiedCarbon: number; // kg CO2-e/m²
      operationalCarbon: number; // kg CO2-e/m²/year
      carbonOffset: boolean;
      renewableEnergyTarget: number; // percentage
      totalCarbonFootprint: number; // tonnes CO2-e
    };
    
    materials: {
      recycledContent: number; // percentage
      localMaterials: number; // percentage
      lowCarbonMaterials: boolean;
      materialWasteReduction: number; // percentage
    };
    
    biodiversity: {
      biodiversityOffsetRequired: boolean;
      offsetArea?: number; // hectares
      habitatCreation: boolean;
      nativeVegetationRetention: number; // percentage
    };
  };
}

export interface NSWSubmissionFormat {
  applicationHeader: {
    applicationNumber: string;
    submissionDate: string;
    planningPortalRef: string;
    assessmentTrack: "complying_development" | "development_application" | "state_significant";
    localCouncil: string;
  };
  
  projectInformation: StateSubmissionData["projectDetails"];
  
  // NSW specific requirements
  basixCommitments: {
    basixCertificateNumber: string;
    basixRating: number;
    energyTargets: {
      space_conditioning: number;
      hot_water: number;
      total_energy: number;
    };
    waterTargets: {
      internal_potable: number;
      external_potable: number;
      total_potable: number;
    };
    commitments: string[];
  };
  
  greenStarCommitment?: {
    targetRating: number;
    ratingTool: string;
    certificationStage: "design" | "as_built";
    registrationNumber?: string;
    accreditedProfessional: string;
  };
  
  nabersCommitment?: {
    targetRating: number;
    buildingType: string;
    ratedArea: number;
    commitmentDate: string;
    verificationMethod: string;
  };
  
  sustainabilityManagementPlan: {
    constructionPhase: {
      wasteMinimization: string[];
      energyManagement: string[];
      waterManagement: string[];
      airQualityManagement: string[];
    };
    operationalPhase: {
      energyMonitoring: string;
      waterMonitoring: string;
      wasteManagement: string;
      maintenanceSchedule: string;
    };
  };
  
  complianceChecklist: {
    sepp65: boolean; // State Environmental Planning Policy No 65
    basixCompliance: boolean;
    greenBuildingRequirements: boolean;
    accessibilityCompliance: boolean;
    stormwaterManagement: boolean;
  };
}

export interface VICSubmissionFormat {
  applicationHeader: {
    planningPermitNumber: string;
    submissionDate: string;
    localCouncil: string;
    applicationTrack: "vcat" | "council" | "minister";
    planningSchemezone: string;
  };
  
  projectInformation: StateSubmissionData["projectDetails"];
  
  // VIC specific requirements
  environmentallySustainableDesign: {
    esdStrategy: string;
    energyEfficiency: {
      thermalPerformance: number; // star rating
      energyGeneration: {
        renewableEnergyTarget: number; // percentage
        solarPVCapacity?: number; // kW
        batteryStorage?: number; // kWh
      };
      energyEfficiencyMeasures: string[];
    };
    
    waterEfficiency: {
      waterSensitiveUrbanDesign: boolean;
      stormwaterManagement: string;
      potableWaterReduction: number; // percentage
      alternativeWaterSources: string[];
    };
    
    wasteManagement: {
      constructionWasteTarget: number; // percentage reduction
      operationalWasteTarget: number; // percentage reduction
      wasteToLandfillReduction: number; // percentage
      organicWasteManagement: boolean;
    };
    
    transportSustainability: {
      publicTransportAccess: boolean;
      cyclingInfrastructure: boolean;
      electricVehicleCharging: boolean;
      carShareProvision: boolean;
    };
    
    urbanHeatIsland: {
      roofReflectance: number;
      pavementReflectance: number;
      greenRoofArea: number; // m²
      canopyCoverTarget: number; // percentage
    };
  };
  
  greenBuildingCertification?: {
    certificationScheme: "green_star" | "nabers" | "living_building_challenge" | "passive_house";
    targetRating: number;
    registrationDetails: string;
    accreditedProfessional: string;
  };
  
  carbonNeutralCommitment?: {
    carbonNeutralTarget: string; // date
    offsetStrategy: string;
    monitoringProtocol: string;
    verificationMethod: string;
  };
  
  complianceChecklist: {
    clause5506SustainableDesign: boolean; // Planning Permit conditions
    stormwaterManagementPlan: boolean;
    greenTravelPlan: boolean;
    wasteManagementPlan: boolean;
    accessibilityCompliance: boolean;
  };
}

export class StatePlanningReportingService {
  
  async generateNSWSubmission(data: StateSubmissionData): Promise<NSWSubmissionFormat> {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const submission: NSWSubmissionFormat = {
      applicationHeader: {
        applicationNumber: `DA-${Date.now()}`,
        submissionDate: currentDate,
        planningPortalRef: `PP-${data.projectDetails.projectId}`,
        assessmentTrack: this.determineNSWAssessmentTrack(data),
        localCouncil: this.extractCouncilFromSuburb(data.projectDetails.location.suburb, "NSW")
      },
      
      projectInformation: data.projectDetails,
      
      basixCommitments: {
        basixCertificateNumber: `BX-${Date.now()}`,
        basixRating: data.sustainabilityAssessment.energyEfficiency.basixRating || 40,
        energyTargets: {
          space_conditioning: 40,
          hot_water: 25,
          total_energy: 35
        },
        waterTargets: {
          internal_potable: 40,
          external_potable: 60,
          total_potable: 50
        },
        commitments: this.generateNSWBasixCommitments(data)
      },
      
      greenStarCommitment: data.sustainabilityAssessment.energyEfficiency.greenStarRating ? {
        targetRating: data.sustainabilityAssessment.energyEfficiency.greenStarRating,
        ratingTool: "Design & As Built v3.1",
        certificationStage: "design",
        accreditedProfessional: "Green Star Accredited Professional"
      } : undefined,
      
      nabersCommitment: data.sustainabilityAssessment.energyEfficiency.nabersCommitment ? {
        targetRating: data.sustainabilityAssessment.energyEfficiency.nabersCommitment,
        buildingType: data.projectDetails.projectType,
        ratedArea: data.projectDetails.floorArea,
        commitmentDate: currentDate,
        verificationMethod: "Independent NABERS assessment post-completion"
      } : undefined,
      
      sustainabilityManagementPlan: {
        constructionPhase: {
          wasteMinimization: [
            "Implement Construction and Demolition Waste Management Plan",
            "Achieve minimum 90% waste diversion from landfill",
            "Implement material separation and recycling protocols",
            "Use prefabricated components to minimize on-site waste"
          ],
          energyManagement: [
            "Use renewable energy for construction where feasible",
            "Implement energy-efficient equipment and lighting",
            "Monitor and report energy consumption during construction",
            "Optimize equipment scheduling to reduce peak demand"
          ],
          waterManagement: [
            "Implement sediment and erosion control measures",
            "Use water-efficient equipment and practices",
            "Implement stormwater quality improvement measures",
            "Monitor groundwater and surface water quality"
          ],
          airQualityManagement: [
            "Dust suppression measures during demolition and construction",
            "Regular air quality monitoring in sensitive areas",
            "Use low-emission equipment where feasible",
            "Implement vehicle emissions management protocols"
          ]
        },
        operationalPhase: {
          energyMonitoring: "Building Management System with sub-metering for major energy uses",
          waterMonitoring: "Smart water meters with leak detection and usage reporting",
          wasteManagement: "Comprehensive waste reduction and recycling program with annual reporting",
          maintenanceSchedule: "Predictive maintenance program optimized for energy and water efficiency"
        }
      },
      
      complianceChecklist: {
        sepp65: data.projectDetails.projectType === "residential" && data.projectDetails.numberOfUnits ? data.projectDetails.numberOfUnits >= 4 : false,
        basixCompliance: true,
        greenBuildingRequirements: data.projectDetails.floorArea > 2500,
        accessibilityCompliance: true,
        stormwaterManagement: true
      }
    };
    
    return submission;
  }
  
  async generateVICSubmission(data: StateSubmissionData): Promise<VICSubmissionFormat> {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const submission: VICSubmissionFormat = {
      applicationHeader: {
        planningPermitNumber: `PP-${Date.now()}`,
        submissionDate: currentDate,
        localCouncil: this.extractCouncilFromSuburb(data.projectDetails.location.suburb, "VIC"),
        applicationTrack: this.determineVICApplicationTrack(data),
        planningSchemezone: this.determinePlanningZone(data)
      },
      
      projectInformation: data.projectDetails,
      
      environmentallySustainableDesign: {
        esdStrategy: "Comprehensive ESD strategy incorporating energy efficiency, water management, waste reduction, and sustainable transport",
        energyEfficiency: {
          thermalPerformance: data.sustainabilityAssessment.energyEfficiency.starRating || 6,
          energyGeneration: {
            renewableEnergyTarget: data.sustainabilityAssessment.carbonImpact.renewableEnergyTarget,
            solarPVCapacity: this.calculateSolarCapacity(data),
            batteryStorage: this.calculateBatteryStorage(data)
          },
          energyEfficiencyMeasures: this.generateVICEnergyMeasures(data)
        },
        
        waterEfficiency: {
          waterSensitiveUrbanDesign: data.sustainabilityAssessment.waterEfficiency.waterSensitiveUrbanDesign,
          stormwaterManagement: "Bioretention systems and permeable paving for stormwater quality treatment",
          potableWaterReduction: data.sustainabilityAssessment.waterEfficiency.targetReduction,
          alternativeWaterSources: this.generateAlternativeWaterSources(data)
        },
        
        wasteManagement: {
          constructionWasteTarget: 90,
          operationalWasteTarget: 70,
          wasteToLandfillReduction: 80,
          organicWasteManagement: true
        },
        
        transportSustainability: {
          publicTransportAccess: true,
          cyclingInfrastructure: true,
          electricVehicleCharging: data.projectDetails.projectType === "residential" || data.projectDetails.projectType === "commercial",
          carShareProvision: data.projectDetails.projectType === "residential" && (data.projectDetails.numberOfUnits || 0) > 20
        },
        
        urbanHeatIsland: {
          roofReflectance: 0.65,
          pavementReflectance: 0.35,
          greenRoofArea: data.projectDetails.floorArea * 0.1,
          canopyCoverTarget: 25
        }
      },
      
      greenBuildingCertification: data.sustainabilityAssessment.energyEfficiency.greenStarRating ? {
        certificationScheme: "green_star",
        targetRating: data.sustainabilityAssessment.energyEfficiency.greenStarRating,
        registrationDetails: `Green Star registration for ${data.projectDetails.projectName}`,
        accreditedProfessional: "Green Star Accredited Professional"
      } : undefined,
      
      carbonNeutralCommitment: data.sustainabilityAssessment.carbonImpact.carbonOffset ? {
        carbonNeutralTarget: "2030",
        offsetStrategy: "Combination of on-site renewable energy and verified carbon offsets",
        monitoringProtocol: "Annual carbon footprint assessment with third-party verification",
        verificationMethod: "Independent verification to Climate Active Carbon Neutral Standard"
      } : undefined,
      
      complianceChecklist: {
        clause5506SustainableDesign: data.projectDetails.floorArea > 1000,
        stormwaterManagementPlan: true,
        greenTravelPlan: data.projectDetails.floorArea > 2500,
        wasteManagementPlan: true,
        accessibilityCompliance: true
      }
    };
    
    return submission;
  }
  
  async generateStateComplianceComparison(data: StateSubmissionData): Promise<any> {
    const nswSubmission = await this.generateNSWSubmission(data);
    const vicSubmission = await this.generateVICSubmission(data);
    
    return {
      projectDetails: data.projectDetails,
      comparison: {
        nsw: {
          keyRequirements: {
            basixRequired: nswSubmission.complianceChecklist.basixCompliance,
            greenStarThreshold: nswSubmission.complianceChecklist.greenBuildingRequirements,
            sepp65Applicable: nswSubmission.complianceChecklist.sepp65
          },
          sustainabilityTargets: {
            energyTarget: nswSubmission.basixCommitments.energyTargets.total_energy,
            waterTarget: nswSubmission.basixCommitments.waterTargets.total_potable,
            greenStarTarget: nswSubmission.greenStarCommitment?.targetRating
          }
        },
        vic: {
          keyRequirements: {
            esdRequired: vicSubmission.complianceChecklist.clause5506SustainableDesign,
            greenTravelPlan: vicSubmission.complianceChecklist.greenTravelPlan,
            stormwaterPlan: vicSubmission.complianceChecklist.stormwaterManagementPlan
          },
          sustainabilityTargets: {
            thermalPerformance: vicSubmission.environmentallySustainableDesign.energyEfficiency.thermalPerformance,
            renewableEnergyTarget: vicSubmission.environmentallySustainableDesign.energyEfficiency.energyGeneration.renewableEnergyTarget,
            waterReduction: vicSubmission.environmentallySustainableDesign.waterEfficiency.potableWaterReduction
          }
        }
      },
      recommendations: {
        crossStateConsiderations: [
          "NSW BASIX requirements may be more stringent for residential developments",
          "VIC ESD requirements provide more flexibility but require comprehensive strategy",
          "Green Star certification can assist compliance in both states",
          "Consider federal NGER and Safeguard Mechanism thresholds for large developments"
        ],
        optimizationOpportunities: [
          "Standardize sustainability measures across multi-state portfolios",
          "Leverage renewable energy investments for both state and federal compliance",
          "Implement advanced monitoring systems to exceed minimum requirements",
          "Consider voluntary carbon neutrality for competitive advantage"
        ]
      }
    };
  }
  
  private determineNSWAssessmentTrack(data: StateSubmissionData): "complying_development" | "development_application" | "state_significant" {
    if (data.projectDetails.developmentValue > 30000000) {
      return "state_significant";
    } else if (data.projectDetails.floorArea < 500 && data.projectDetails.projectType === "residential") {
      return "complying_development";
    } else {
      return "development_application";
    }
  }
  
  private determineVICApplicationTrack(data: StateSubmissionData): "vcat" | "council" | "minister" {
    if (data.projectDetails.developmentValue > 50000000) {
      return "minister";
    } else {
      return "council";
    }
  }
  
  private determinePlanningZone(data: StateSubmissionData): string {
    switch (data.projectDetails.projectType) {
      case "residential": return "Residential Growth Zone";
      case "commercial": return "Commercial 1 Zone";
      case "mixed_use": return "Mixed Use Zone";
      case "industrial": return "Industrial 1 Zone";
      default: return "General Residential Zone";
    }
  }
  
  private extractCouncilFromSuburb(suburb: string, state: string): string {
    // Simplified mapping - would be more comprehensive in production
    const councilMappings: { [key: string]: string } = {
      "Sydney": "City of Sydney",
      "Melbourne": "Melbourne City Council",
      "Brisbane": "Brisbane City Council",
      "Perth": "City of Perth",
      "Adelaide": "Adelaide City Council"
    };
    
    return councilMappings[suburb] || `${suburb} Council`;
  }
  
  private generateNSWBasixCommitments(data: StateSubmissionData): string[] {
    const commitments: string[] = [
      "Install minimum 6-star gas or electric hot water system",
      "Implement water-efficient fixtures and fittings",
      "Install roof insulation with minimum R-value requirements"
    ];
    
    if (data.sustainabilityAssessment.waterEfficiency.rainwaterHarvesting) {
      commitments.push("Install rainwater harvesting system for toilet flushing and garden irrigation");
    }
    
    if (data.sustainabilityAssessment.energyEfficiency.greenStarRating) {
      commitments.push("Achieve minimum Green Star rating as committed");
    }
    
    return commitments;
  }
  
  private generateVICEnergyMeasures(data: StateSubmissionData): string[] {
    return [
      "High-performance building envelope with enhanced thermal performance",
      "Energy-efficient HVAC systems with smart controls",
      "LED lighting throughout with daylight sensors",
      "Solar PV system with battery storage capability",
      "Building energy management system with real-time monitoring"
    ];
  }
  
  private generateAlternativeWaterSources(data: StateSubmissionData): string[] {
    const sources: string[] = [];
    
    if (data.sustainabilityAssessment.waterEfficiency.rainwaterHarvesting) {
      sources.push("Rainwater harvesting");
    }
    
    if (data.sustainabilityAssessment.waterEfficiency.greyWaterRecycling) {
      sources.push("Greywater recycling");
    }
    
    sources.push("Stormwater harvesting and treatment");
    
    return sources;
  }
  
  private calculateSolarCapacity(data: StateSubmissionData): number {
    // Simplified calculation: 1kW per 100m² of floor area
    return Math.round(data.projectDetails.floorArea / 100);
  }
  
  private calculateBatteryStorage(data: StateSubmissionData): number {
    const solarCapacity = this.calculateSolarCapacity(data);
    // Battery storage typically 2-4 hours of solar capacity
    return Math.round(solarCapacity * 3);
  }
}

export const statePlanningReportingService = new StatePlanningReportingService();