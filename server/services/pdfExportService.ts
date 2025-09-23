// PDF Export Service for Australian Compliance Reports
// Generates officially formatted PDF reports for NGER, Safeguard Mechanism, and State Planning submissions

export interface PDFGenerationOptions {
  reportType: "nger" | "safeguard" | "nsw_planning" | "vic_planning" | "comprehensive_australian";
  documentTitle: string;
  includeExecutiveSummary: boolean;
  includeDetailedData: boolean;
  includeCharts: boolean;
  watermark?: string;
  confidential: boolean;
  footerText?: string;
}

export interface PDFDocumentStructure {
  coverPage: {
    title: string;
    subtitle: string;
    reportingPeriod: string;
    organizationName: string;
    documentNumber: string;
    preparationDate: string;
    version: string;
    confidentialityLevel: string;
    logoPlacement?: string;
  };
  
  executiveSummary?: {
    overview: string;
    keyFindings: string[];
    recommendations: string[];
    complianceStatus: string;
    nextSteps: string[];
  };
  
  tableOfContents: {
    sections: Array<{
      title: string;
      pageNumber: number;
      subsections?: Array<{
        title: string;
        pageNumber: number;
      }>;
    }>;
  };
  
  mainContent: {
    sections: Array<{
      sectionNumber: string;
      title: string;
      content: any;
      tables?: Array<{
        title: string;
        headers: string[];
        rows: string[][];
        formatting?: any;
      }>;
      charts?: Array<{
        type: "bar" | "line" | "pie" | "area";
        title: string;
        data: any;
        description: string;
      }>;
    }>;
  };
  
  appendices?: Array<{
    title: string;
    content: any;
    attachments?: string[];
  }>;
  
  certificationPage?: {
    certificationStatement: string;
    signatoryName: string;
    signatoryTitle: string;
    certificationDate: string;
    companyStamp?: boolean;
  };
}

export class PDFExportService {
  
  async generateNGERReportPDF(ngerReport: any, options: PDFGenerationOptions): Promise<string> {
    const documentStructure = this.buildNGERDocumentStructure(ngerReport);
    return this.generatePDFFromStructure(documentStructure, options);
  }
  
  async generateSafeguardReportPDF(safeguardReport: any, options: PDFGenerationOptions): Promise<string> {
    const documentStructure = this.buildSafeguardDocumentStructure(safeguardReport);
    return this.generatePDFFromStructure(documentStructure, options);
  }
  
  async generateStatePlanningReportPDF(statePlanningReport: any, state: "NSW" | "VIC", options: PDFGenerationOptions): Promise<string> {
    const documentStructure = this.buildStatePlanningDocumentStructure(statePlanningReport, state);
    return this.generatePDFFromStructure(documentStructure, options);
  }
  
  async generateComprehensiveAustralianReportPDF(comprehensiveReport: any, options: PDFGenerationOptions): Promise<string> {
    const documentStructure = this.buildComprehensiveDocumentStructure(comprehensiveReport);
    return this.generatePDFFromStructure(documentStructure, options);
  }
  
  private buildNGERDocumentStructure(ngerReport: any): PDFDocumentStructure {
    return {
      coverPage: {
        title: "National Greenhouse and Energy Reporting (NGER) Compliance Report",
        subtitle: `Facility: ${ngerReport.facilityInformation?.facilityName || 'Not Specified'}`,
        reportingPeriod: `Reporting Year: ${ngerReport.reportingPeriod?.year || new Date().getFullYear() - 1}`,
        organizationName: ngerReport.corporateGroup?.corporateGroupName || "Construction Facility",
        documentNumber: `NGER-${Date.now()}`,
        preparationDate: new Date().toLocaleDateString('en-AU'),
        version: "1.0",
        confidentialityLevel: "Commercial in Confidence",
      },
      
      executiveSummary: {
        overview: `This NGER compliance report presents the greenhouse gas emissions and energy consumption data for the ${ngerReport.reportingPeriod?.year || new Date().getFullYear() - 1} reporting period.`,
        keyFindings: [
          `Total facility emissions: ${ngerReport.executiveSummary?.totalEmissions || 0} tonnes CO₂-e`,
          `Scope 1 emissions: ${ngerReport.sectionA?.scope1Emissions?.total || 0} tonnes CO₂-e`,
          `Scope 2 emissions: ${ngerReport.sectionA?.scope2Emissions?.total || 0} tonnes CO₂-e`,
          `Total energy consumption: ${ngerReport.sectionB?.energyConsumption?.total || 0} TJ`,
          `Facility meets NGER reporting thresholds: ${ngerReport.executiveSummary?.thresholdMet ? 'Yes' : 'No'}`
        ],
        recommendations: ngerReport.executiveSummary?.recommendations || [
          "Implement energy efficiency measures to reduce scope 2 emissions",
          "Conduct regular facility emissions audits",
          "Explore renewable energy procurement opportunities",
          "Enhance data collection and monitoring systems"
        ],
        complianceStatus: ngerReport.executiveSummary?.complianceStatus || "Compliant",
        nextSteps: [
          "Submit NGER report by 31 October deadline",
          "Maintain records for audit purposes",
          "Plan for next reporting period improvements",
          "Review baseline methodologies"
        ]
      },
      
      tableOfContents: {
        sections: [
          { title: "Executive Summary", pageNumber: 3 },
          { title: "1. Facility Information", pageNumber: 5 },
          { title: "2. Greenhouse Gas Emissions Data", pageNumber: 8 },
          { title: "3. Energy Consumption Data", pageNumber: 12 },
          { title: "4. Methodology and Calculations", pageNumber: 16 },
          { title: "5. Quality Assurance and Verification", pageNumber: 20 },
          { title: "6. Compliance Assessment", pageNumber: 22 },
          { title: "Appendices", pageNumber: 24 }
        ]
      },
      
      mainContent: {
        sections: [
          {
            sectionNumber: "1",
            title: "Facility Information",
            content: ngerReport.facilityInformation,
            tables: [{
              title: "Facility Details",
              headers: ["Parameter", "Value"],
              rows: [
                ["Facility ID", ngerReport.facilityInformation?.facilityId || "Not Specified"],
                ["Facility Name", ngerReport.facilityInformation?.facilityName || "Not Specified"],
                ["Primary Activity", ngerReport.facilityInformation?.primaryActivity || "Construction"],
                ["Location", ngerReport.facilityInformation?.location || "Australia"],
                ["Reporting Entity", ngerReport.corporateGroup?.corporateGroupName || "Not Specified"]
              ]
            }]
          },
          {
            sectionNumber: "2",
            title: "Greenhouse Gas Emissions Data",
            content: ngerReport.sectionA,
            tables: [
              {
                title: "Scope 1 Emissions Breakdown",
                headers: ["Emission Source", "Emissions (tonnes CO₂-e)"],
                rows: [
                  ["Fuel Combustion", (ngerReport.sectionA?.scope1Emissions?.fuelCombustion || 0).toString()],
                  ["Fugitive Emissions", (ngerReport.sectionA?.scope1Emissions?.fugitiveEmissions || 0).toString()],
                  ["Industrial Processes", (ngerReport.sectionA?.scope1Emissions?.industrialProcesses || 0).toString()],
                  ["Total Scope 1", (ngerReport.sectionA?.scope1Emissions?.total || 0).toString()]
                ]
              },
              {
                title: "Scope 2 Emissions Breakdown",
                headers: ["Emission Source", "Emissions (tonnes CO₂-e)"],
                rows: [
                  ["Electricity Consumption", (ngerReport.sectionA?.scope2Emissions?.electricity || 0).toString()],
                  ["Steam Consumption", (ngerReport.sectionA?.scope2Emissions?.steam || 0).toString()],
                  ["Heating/Cooling", (ngerReport.sectionA?.scope2Emissions?.heating || 0).toString()],
                  ["Total Scope 2", (ngerReport.sectionA?.scope2Emissions?.total || 0).toString()]
                ]
              }
            ],
            charts: [{
              type: "pie",
              title: "Emissions by Scope",
              data: {
                labels: ["Scope 1", "Scope 2"],
                values: [
                  ngerReport.sectionA?.scope1Emissions?.total || 0,
                  ngerReport.sectionA?.scope2Emissions?.total || 0
                ]
              },
              description: "Distribution of greenhouse gas emissions by scope"
            }]
          },
          {
            sectionNumber: "3",
            title: "Energy Consumption Data",
            content: ngerReport.sectionB,
            tables: [{
              title: "Energy Consumption by Fuel Type",
              headers: ["Fuel Type", "Consumption (TJ)"],
              rows: [
                ["Electricity", (ngerReport.sectionB?.energyConsumption?.electricity || 0).toString()],
                ["Natural Gas", (ngerReport.sectionB?.energyConsumption?.naturalGas || 0).toString()],
                ["Diesel", (ngerReport.sectionB?.energyConsumption?.diesel || 0).toString()],
                ["Other Fuels", (ngerReport.sectionB?.energyConsumption?.other || 0).toString()],
                ["Total", (ngerReport.sectionB?.energyConsumption?.total || 0).toString()]
              ]
            }]
          }
        ]
      },
      
      appendices: [
        {
          title: "Appendix A: Calculation Methodologies",
          content: "Detailed methodologies used for emissions and energy calculations as per NGER Act requirements."
        },
        {
          title: "Appendix B: Supporting Documentation",
          content: "List of supporting documents, data sources, and verification records."
        }
      ],
      
      certificationPage: {
        certificationStatement: "I certify that the information contained in this NGER report is accurate and complete to the best of my knowledge and belief, and that all reasonable steps have been taken to ensure compliance with the National Greenhouse and Energy Reporting Act 2007.",
        signatoryName: "Facility Manager",
        signatoryTitle: "Responsible Person",
        certificationDate: new Date().toLocaleDateString('en-AU'),
        companyStamp: true
      }
    };
  }
  
  private buildSafeguardDocumentStructure(safeguardReport: any): PDFDocumentStructure {
    return {
      coverPage: {
        title: "Safeguard Mechanism Compliance Report",
        subtitle: `Facility: ${safeguardReport.facilityData?.facilityName || 'Large Emission Facility'}`,
        reportingPeriod: `Reporting Year: ${safeguardReport.facilityData?.emissions?.reportingYear || new Date().getFullYear() - 1}`,
        organizationName: safeguardReport.facilityData?.operatingEntity || "Construction Company",
        documentNumber: `SGM-${Date.now()}`,
        preparationDate: new Date().toLocaleDateString('en-AU'),
        version: "1.0",
        confidentialityLevel: "Commercial in Confidence",
      },
      
      executiveSummary: {
        overview: "This Safeguard Mechanism compliance report demonstrates adherence to baseline requirements and outlines emission reduction strategies.",
        keyFindings: [
          `Facility baseline: ${safeguardReport.facilityData?.baseline?.adjustedBaseline || 0} tonnes CO₂-e`,
          `Actual emissions: ${safeguardReport.facilityData?.emissions?.actualEmissions || 0} tonnes CO₂-e`,
          `Net position: ${safeguardReport.facilityData?.emissions?.netPosition || 0} tonnes CO₂-e`,
          `Compliance status: ${safeguardReport.executiveSummary?.baselineCompliance ? 'Compliant' : 'Non-compliant'}`,
          `Reduction measures implemented: ${safeguardReport.facilityData?.reductionMeasures?.implemented?.length || 0}`
        ],
        recommendations: safeguardReport.executiveSummary?.mitigationActions || [
          "Continue implementation of planned reduction measures",
          "Explore additional efficiency opportunities",
          "Consider renewable energy procurement",
          "Maintain credit reserve for future compliance"
        ],
        complianceStatus: safeguardReport.executiveSummary?.baselineCompliance ? "Compliant" : "Requires Action",
        nextSteps: [
          "Monitor ongoing reduction measure performance",
          "Plan for declining baseline requirements",
          "Assess credit requirements for future periods",
          "Update reduction strategy as needed"
        ]
      },
      
      tableOfContents: {
        sections: [
          { title: "Executive Summary", pageNumber: 3 },
          { title: "1. Facility Overview", pageNumber: 5 },
          { title: "2. Baseline Assessment", pageNumber: 8 },
          { title: "3. Emissions Performance", pageNumber: 11 },
          { title: "4. Reduction Strategies", pageNumber: 14 },
          { title: "5. Credit Management", pageNumber: 17 },
          { title: "6. Future Projections", pageNumber: 19 },
          { title: "Appendices", pageNumber: 21 }
        ]
      },
      
      mainContent: {
        sections: [
          {
            sectionNumber: "1",
            title: "Facility Overview",
            content: safeguardReport.facilityData,
            tables: [{
              title: "Facility Information",
              headers: ["Parameter", "Value"],
              rows: [
                ["Facility ID", safeguardReport.facilityData?.facilityId || "SGM-001"],
                ["Corporate Group", safeguardReport.facilityData?.corporateGroup || "Construction Group"],
                ["Primary Activity", "Construction Operations"],
                ["Location", safeguardReport.facilityData?.location?.state || "Australia"],
                ["Baseline Type", "Production-adjusted"]
              ]
            }]
          },
          {
            sectionNumber: "2",
            title: "Baseline Assessment",
            content: safeguardReport.facilityData?.baseline,
            tables: [{
              title: "Baseline Information",
              headers: ["Baseline Component", "Value (tonnes CO₂-e)"],
              rows: [
                ["Original Baseline", (safeguardReport.facilityData?.baseline?.originalBaseline || 0).toString()],
                ["Current Baseline", (safeguardReport.facilityData?.baseline?.currentBaseline || 0).toString()],
                ["Decline Rate", `${safeguardReport.facilityData?.baseline?.declineRate || 4.9}% per annum`],
                ["Adjusted Baseline", (safeguardReport.facilityData?.baseline?.adjustedBaseline || 0).toString()]
              ]
            }]
          },
          {
            sectionNumber: "4",
            title: "Reduction Strategies",
            content: safeguardReport.facilityData?.reductionMeasures,
            tables: [{
              title: "Implemented Reduction Measures",
              headers: ["Measure", "Category", "Reduction (tonnes CO₂-e)", "Status"],
              rows: (safeguardReport.facilityData?.reductionMeasures?.implemented || []).map((measure: any) => [
                measure.title || "Energy Efficiency Measure",
                measure.category || "energy_efficiency",
                (measure.estimatedReduction || 0).toString(),
                measure.status || "completed"
              ])
            }]
          }
        ]
      }
    };
  }
  
  private buildStatePlanningDocumentStructure(statePlanningReport: any, state: "NSW" | "VIC"): PDFDocumentStructure {
    const statePrefix = state === "NSW" ? "NSW Development Application" : "VIC Planning Permit Application";
    
    return {
      coverPage: {
        title: `${statePrefix} - Sustainability Assessment`,
        subtitle: `Project: ${statePlanningReport.projectInformation?.projectName || 'Construction Project'}`,
        reportingPeriod: `Application Date: ${new Date().toLocaleDateString('en-AU')}`,
        organizationName: statePlanningReport.projectInformation?.applicant?.company || "Development Company",
        documentNumber: `${state}-${Date.now()}`,
        preparationDate: new Date().toLocaleDateString('en-AU'),
        version: "1.0",
        confidentialityLevel: "Planning Application Document",
      },
      
      executiveSummary: {
        overview: `This sustainability assessment supports the ${statePrefix.toLowerCase()} for a ${statePlanningReport.projectInformation?.projectType} development.`,
        keyFindings: [
          `Project Type: ${statePlanningReport.projectInformation?.projectType || 'mixed_use'}`,
          `Total Floor Area: ${statePlanningReport.projectInformation?.floorArea || 0} m²`,
          `Development Value: $${(statePlanningReport.projectInformation?.developmentValue || 0).toLocaleString('en-AU')}`,
          `Energy Rating Target: ${state === "NSW" ? statePlanningReport.basixCommitments?.basixRating : statePlanningReport.environmentallySustainableDesign?.energyEfficiency?.thermalPerformance || 6} stars`,
          `Green Building Certification: ${statePlanningReport.greenStarCommitment?.targetRating || statePlanningReport.greenBuildingCertification?.targetRating || 'Not applicable'}`
        ],
        recommendations: [
          "Implement comprehensive sustainability management plan",
          "Achieve committed energy and water efficiency targets",
          "Maintain compliance with relevant building standards",
          "Establish monitoring and verification protocols"
        ],
        complianceStatus: "Meets Planning Requirements",
        nextSteps: [
          "Proceed with detailed design development",
          "Finalize sustainability commitments",
          "Establish construction management protocols",
          "Schedule post-completion verification"
        ]
      },
      
      tableOfContents: {
        sections: [
          { title: "Executive Summary", pageNumber: 3 },
          { title: "1. Project Information", pageNumber: 5 },
          { title: "2. Sustainability Strategy", pageNumber: 8 },
          { title: "3. Compliance Assessment", pageNumber: 12 },
          { title: "4. Implementation Plan", pageNumber: 15 },
          { title: "Appendices", pageNumber: 18 }
        ]
      },
      
      mainContent: {
        sections: [
          {
            sectionNumber: "1",
            title: "Project Information",
            content: statePlanningReport.projectInformation,
            tables: [{
              title: "Development Details",
              headers: ["Parameter", "Value"],
              rows: [
                ["Project Name", statePlanningReport.projectInformation?.projectName || "Construction Project"],
                ["Project Type", statePlanningReport.projectInformation?.projectType || "mixed_use"],
                ["Location", `${statePlanningReport.projectInformation?.location?.suburb}, ${statePlanningReport.projectInformation?.location?.state}`],
                ["Floor Area", `${statePlanningReport.projectInformation?.floorArea || 0} m²`],
                ["Development Value", `$${(statePlanningReport.projectInformation?.developmentValue || 0).toLocaleString('en-AU')}`]
              ]
            }]
          }
        ]
      }
    };
  }
  
  private buildComprehensiveDocumentStructure(comprehensiveReport: any): PDFDocumentStructure {
    return {
      coverPage: {
        title: "Comprehensive Australian Construction Industry Compliance Report",
        subtitle: `Multi-Framework Assessment for Project ${comprehensiveReport.reportMetadata?.projectId || 'Default'}`,
        reportingPeriod: `Reporting Year: ${comprehensiveReport.reportMetadata?.reportingYear || new Date().getFullYear() - 1}`,
        organizationName: "Construction Industry Operator",
        documentNumber: `AUS-COMP-${Date.now()}`,
        preparationDate: new Date().toLocaleDateString('en-AU'),
        version: "1.0",
        confidentialityLevel: "Commercial in Confidence",
      },
      
      executiveSummary: {
        overview: "This comprehensive report integrates Australian federal and state regulatory compliance requirements across multiple frameworks.",
        keyFindings: [
          `Overall Compliance Score: ${comprehensiveReport.executiveSummary?.overallComplianceScore || 0}%`,
          `Total Emissions: ${comprehensiveReport.executiveSummary?.totalEmissions || 0} tonnes CO₂-e`,
          `Regulatory Frameworks: ${comprehensiveReport.executiveSummary?.regulatoryFrameworks?.join(', ') || 'NGER, Safeguard, NCC, Green Star, NABERS'}`,
          `Compliance Status: ${comprehensiveReport.executiveSummary?.complianceStatus || 'Compliant'}`,
          `Green Star Average: ${comprehensiveReport.ratingSystems?.greenStar?.averageRating || 0} stars`
        ],
        recommendations: comprehensiveReport.recommendations || [
          "Maintain comprehensive compliance monitoring",
          "Integrate sustainability across all project phases",
          "Leverage federal and state synergies",
          "Pursue voluntary excellence beyond minimum requirements"
        ],
        complianceStatus: comprehensiveReport.executiveSummary?.complianceStatus || "Compliant",
        nextSteps: comprehensiveReport.nextActions || [
          "Continue monitoring across all frameworks",
          "Prepare for upcoming regulatory changes",
          "Optimize cross-framework efficiencies",
          "Maintain stakeholder engagement"
        ]
      },
      
      tableOfContents: {
        sections: [
          { title: "Executive Summary", pageNumber: 3 },
          { title: "1. Federal Compliance", pageNumber: 5 },
          { title: "2. Rating Systems", pageNumber: 9 },
          { title: "3. Integrated Assessment", pageNumber: 13 },
          { title: "4. Strategic Recommendations", pageNumber: 16 },
          { title: "Appendices", pageNumber: 19 }
        ]
      },
      
      mainContent: {
        sections: [
          {
            sectionNumber: "1",
            title: "Federal Compliance Assessment",
            content: comprehensiveReport.federalCompliance,
            tables: [
              {
                title: "NGER Compliance Status",
                headers: ["Parameter", "Value"],
                rows: [
                  ["Status", comprehensiveReport.federalCompliance?.nger?.status || "not_applicable"],
                  ["Threshold Met", comprehensiveReport.federalCompliance?.nger?.thresholdMet ? "Yes" : "No"],
                  ["Next Deadline", comprehensiveReport.federalCompliance?.nger?.nextDeadline || "2025-10-31"]
                ]
              },
              {
                title: "Safeguard Mechanism Status",
                headers: ["Parameter", "Value"],
                rows: [
                  ["Status", comprehensiveReport.federalCompliance?.safeguardMechanism?.status || "below_threshold"],
                  ["Baseline", `${comprehensiveReport.federalCompliance?.safeguardMechanism?.baseline || 0} tonnes CO₂-e`],
                  ["Current Level", `${comprehensiveReport.federalCompliance?.safeguardMechanism?.currentLevel || 0} tonnes CO₂-e`]
                ]
              }
            ]
          },
          {
            sectionNumber: "2",
            title: "Rating Systems Performance",
            content: comprehensiveReport.ratingSystems,
            tables: [{
              title: "Certification Summary",
              headers: ["Rating System", "Count", "Average Rating"],
              rows: [
                ["Green Star", (comprehensiveReport.ratingSystems?.greenStar?.count || 0).toString(), (comprehensiveReport.ratingSystems?.greenStar?.averageRating || 0).toString()],
                ["NABERS", (comprehensiveReport.ratingSystems?.nabers?.count || 0).toString(), (comprehensiveReport.ratingSystems?.nabers?.averageRating || 0).toString()],
                ["NCC Compliance", (comprehensiveReport.ratingSystems?.ncc?.count || 0).toString(), `${comprehensiveReport.ratingSystems?.ncc?.complianceRate || 0}%`]
              ]
            }]
          }
        ]
      }
    };
  }
  
  private async generatePDFFromStructure(structure: PDFDocumentStructure, options: PDFGenerationOptions): Promise<string> {
    // In a real implementation, this would use a PDF generation library like PDFKit, jsPDF, or Puppeteer
    // For now, we'll return HTML that could be converted to PDF
    
    const htmlContent = this.generateHTMLFromStructure(structure, options);
    
    // Simulate PDF generation - in production, would convert HTML to PDF
    const pdfFileName = `${options.reportType}_report_${Date.now()}.pdf`;
    
    // Return the PDF file path or base64 content
    return pdfFileName;
  }
  
  private generateHTMLFromStructure(structure: PDFDocumentStructure, options: PDFGenerationOptions): string {
    const { coverPage, executiveSummary, tableOfContents, mainContent, appendices, certificationPage } = structure;
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${coverPage.title}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
            @bottom-center {
                content: "${options.footerText || 'Australian Construction Industry Compliance Report'}";
                font-size: 10px;
                color: #666;
            }
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .cover-page {
            text-align: center;
            page-break-after: always;
            padding: 100px 0;
        }
        
        .cover-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .cover-subtitle {
            font-size: 18px;
            margin-bottom: 15px;
            color: #34495e;
        }
        
        .cover-details {
            margin: 40px 0;
            font-size: 14px;
        }
        
        .section {
            page-break-before: auto;
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }
        
        .subsection-title {
            font-size: 16px;
            font-weight: bold;
            color: #34495e;
            margin: 20px 0 10px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        
        .toc {
            page-break-after: always;
        }
        
        .toc-entry {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
        }
        
        .executive-summary {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
        }
        
        .certification {
            page-break-before: always;
            text-align: center;
            padding: 50px 0;
        }
        
        .signature-line {
            border-bottom: 1px solid #333;
            width: 300px;
            margin: 50px auto 10px auto;
        }
        
        ${options.confidential ? '.watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(255, 0, 0, 0.1); z-index: -1; }' : ''}
    </style>
</head>
<body>
    ${options.confidential ? '<div class="watermark">CONFIDENTIAL</div>' : ''}
    
    <!-- Cover Page -->
    <div class="cover-page">
        <div class="cover-title">${coverPage.title}</div>
        <div class="cover-subtitle">${coverPage.subtitle}</div>
        <div class="cover-details">
            <p><strong>Document Number:</strong> ${coverPage.documentNumber}</p>
            <p><strong>Reporting Period:</strong> ${coverPage.reportingPeriod}</p>
            <p><strong>Organization:</strong> ${coverPage.organizationName}</p>
            <p><strong>Preparation Date:</strong> ${coverPage.preparationDate}</p>
            <p><strong>Version:</strong> ${coverPage.version}</p>
            <p><strong>Confidentiality:</strong> ${coverPage.confidentialityLevel}</p>
        </div>
    </div>
    
    <!-- Table of Contents -->
    <div class="toc">
        <h1 class="section-title">Table of Contents</h1>
        ${tableOfContents.sections.map(section => `
            <div class="toc-entry">
                <span>${section.title}</span>
                <span>${section.pageNumber}</span>
            </div>
        `).join('')}
    </div>
    
    ${options.includeExecutiveSummary && executiveSummary ? `
    <!-- Executive Summary -->
    <div class="section">
        <h1 class="section-title">Executive Summary</h1>
        <div class="executive-summary">
            <p>${executiveSummary.overview}</p>
            
            <h3 class="subsection-title">Key Findings</h3>
            <ul>
                ${executiveSummary.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>
            
            <h3 class="subsection-title">Recommendations</h3>
            <ul>
                ${executiveSummary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            
            <p><strong>Compliance Status:</strong> ${executiveSummary.complianceStatus}</p>
        </div>
    </div>
    ` : ''}
    
    <!-- Main Content -->
    ${mainContent.sections.map(section => `
        <div class="section">
            <h1 class="section-title">${section.sectionNumber}. ${section.title}</h1>
            
            ${section.tables ? section.tables.map(table => `
                <h3 class="subsection-title">${table.title}</h3>
                <table>
                    <thead>
                        <tr>
                            ${table.headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${table.rows.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('') : ''}
            
            ${section.charts && options.includeCharts ? section.charts.map(chart => `
                <h3 class="subsection-title">${chart.title}</h3>
                <p><em>Chart: ${chart.description}</em></p>
                <div style="border: 1px solid #ddd; padding: 20px; text-align: center; margin: 10px 0;">
                    [${chart.type.toUpperCase()} CHART: ${chart.title}]
                </div>
            `).join('') : ''}
        </div>
    `).join('')}
    
    ${appendices ? appendices.map(appendix => `
        <div class="section">
            <h1 class="section-title">${appendix.title}</h1>
            <p>${appendix.content}</p>
        </div>
    `).join('') : ''}
    
    ${certificationPage ? `
    <!-- Certification Page -->
    <div class="certification">
        <h1 class="section-title">Certification Statement</h1>
        <p style="margin: 30px 0; font-style: italic;">${certificationPage.certificationStatement}</p>
        
        <div class="signature-line"></div>
        <p><strong>${certificationPage.signatoryName}</strong></p>
        <p>${certificationPage.signatoryTitle}</p>
        <p>Date: ${certificationPage.certificationDate}</p>
        
        ${certificationPage.companyStamp ? '<p style="margin-top: 50px;"><em>[Company Stamp]</em></p>' : ''}
    </div>
    ` : ''}
    
</body>
</html>`;
    
    return html;
  }
}

export const pdfExportService = new PDFExportService();