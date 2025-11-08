/**
 * carbon-intelligence-dashboard.js
 *
 * Interactive visualization and reporting tools for the CarbonIntelligence System.
 * This module provides Sankey diagrams, material impact heat maps,
 * compliance tracking dashboards, and optimization visualizations.
 *
 * @author Climate Scientist & Steven Jenkins
 * @version 2.0.0
 * @company CarbonConstruct
 */

// Import Chart.js for visualizations (assumed to be loaded in the browser)
// const Chart = require('chart.js');

/**
 * Dashboard visualization system for CarbonIntelligence
 */
class CarbonIntelligenceDashboard {
    /**
     * Initialize the dashboard
     *
     * @param {string} containerId - HTML element ID to render the dashboard
     * @param {string} theme - Dashboard theme (standard, professional, minimal)
     */
    constructor(containerId, theme = 'standard') {
        this.containerId = containerId;
        this.theme = theme;
        this.data = null;
        this.charts = {};

        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container element with ID '${containerId}' not found.`);
            return;
        }

        // Set theme colors
        this.colors = this._getThemeColors(theme);

        // Advanced features state
        this.coverageTarget = 50; // Default 50% coverage target
        this.activeLifecycleStages = ['A1-A3', 'A4-A5', 'B1-B7', 'C1-C4', 'D']; // All stages active by default
        this.australianContextEnabled = true; // Australian intelligence enabled by default

        console.log(`CarbonIntelligence Dashboard initialized with ${theme} theme`);
    }

    /**
     * Render the dashboard with calculation results
     *
     * @param {Object} results - Comprehensive calculation results from CarbonIntelligenceCore
     * @returns {Promise<boolean>} Success status
     */
    async render(results) {
        console.log('Rendering CarbonIntelligence Dashboard');

        try {
            // Store results data
            this.data = results;

            // Clear the container
            this.container.innerHTML = '';

            // Add dashboard header
            this._addHeader();

            // Create main dashboard layout
            const layout = this._createLayout();
            this.container.appendChild(layout);

            // Render each section
            await Promise.all([
                this._renderScopeExplanation(),
                this._renderSummarySection(),
                this._renderMaterialsSection(),
                this._renderLifecycleSection(),
                this._renderComplianceSection(),
                this._renderOptimizationSection()
            ]);

            console.log('Dashboard rendering complete');
            return true;

        } catch (error) {
            console.error('Error rendering dashboard:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <h3>Dashboard Error</h3>
                    <p>Failed to render dashboard: ${error.message}</p>
                </div>
            `;
            return false;
        }
    }

    /**
     * Generate a report from the dashboard data
     *
     * @param {Object} options - Report generation options
     * @param {string} options.format - Report format (pdf, html, excel)
     * @param {string} options.title - Report title
     * @param {string} options.client - Client name
     * @param {string} options.projectNumber - Project number
     * @param {Array<string>} options.includeSections - Sections to include
     * @returns {Promise<Object>} Report data
     */
    async generateReport(options) {
        console.log(`Generating ${options.format} report`);

        if (!this.data) {
            throw new Error('No data available. Run calculations before generating a report.');
        }

        // In a real implementation, this would generate a report in the specified format
        // For this example, we'll simulate the report generation

        const reportData = {
            format: options.format || 'pdf',
            title: options.title || 'Carbon Assessment Report',
            client: options.client || 'Client',
            projectNumber: options.projectNumber || 'P12345',
            sections: options.includeSections || [
                'executive-summary',
                'materials-breakdown',
                'lca-analysis',
                'compliance-status',
                'optimization-recommendations'
            ],
            generatedAt: new Date().toISOString(),
            data: this.data
        };

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Report generated successfully');
        return reportData;
    }

    /**
     * Download a generated report
     *
     * @param {Object} reportData - Report data from generateReport()
     * @param {string} filename - Filename for the download
     */
    downloadReport(reportData, filename) {
        console.log(`Downloading report as ${filename}`);

        // In a real implementation, this would create a downloadable file
        // For this example, we'll simulate the download

        alert(`Report "${filename}" would now be downloaded in a real implementation.`);
    }

    /**
     * Add dashboard header with project info and total carbon summary
     *
     * @private
     */
    _addHeader() {
        const { projectInfo, totalCarbon } = this.data;

        const header = document.createElement('div');
        header.className = 'dashboard-header';

        header.innerHTML = `
            <div class="project-info">
                <h1>${projectInfo.name || 'Unnamed Project'}</h1>
                <div class="project-details">
                    <span>${projectInfo.buildingType || 'Building'}</span>
                    <span>|</span>
                    <span>${projectInfo.location.city || ''}, ${projectInfo.location.state.toUpperCase() || ''}</span>
                    <span>|</span>
                    <span>${projectInfo.gfa.toLocaleString()} m²</span>
                    <span>|</span>
                    <span>Climate Zone ${projectInfo.climateZone}</span>
                </div>
            </div>
            <div class="carbon-summary">
                <div class="total-carbon">
                    <h2>${Math.round(totalCarbon.wholeOfLife).toLocaleString()}</h2>
                    <span>tonnes CO₂-e</span>
                </div>
                <div class="carbon-intensity">
                    <h3>${Math.round(totalCarbon.perSquareMeter.total).toLocaleString()}</h3>
                    <span>kg CO₂-e/m²</span>
                </div>
            </div>
        `;

        this.container.appendChild(header);
    }

    /**
     * Create main dashboard layout structure
     *
     * @private
     * @returns {HTMLElement} Layout container element
     */
    _createLayout() {
        const layout = document.createElement('div');
        layout.className = 'dashboard-layout';

        layout.innerHTML = `
            <section id="scope-explanation-section" class="dashboard-section scope-explanation">
                <h2>Understanding Your Carbon Footprint</h2>
                <div class="section-content"></div>
            </section>

            <section id="summary-section" class="dashboard-section">
                <h2>Carbon Footprint Hierarchy</h2>
                <div class="section-content"></div>
            </section>

            <section id="materials-section" class="dashboard-section">
                <h2>Materials Impact Analysis</h2>
                <div class="section-content"></div>
            </section>

            <section id="lifecycle-section" class="dashboard-section">
                <h2>Lifecycle Assessment</h2>
                <div class="section-content"></div>
            </section>

            <section id="compliance-section" class="dashboard-section">
                <h2>Compliance Status</h2>
                <div class="section-content"></div>
            </section>

            <section id="optimization-section" class="dashboard-section">
                <h2>Optimization Opportunities</h2>
                <div class="section-content"></div>
            </section>
        `;

        return layout;
    }

    /**
     * Render scope explanation section
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderScopeExplanation() {
        const section = document.querySelector('#scope-explanation-section .section-content');
        const { totalCarbon, coverageAnalysis, projectInfo } = this.data;

        section.innerHTML = `
            <div class="scope-explanation-content">
                <div class="scope-intro">
                    <p class="lead-text">
                        This analysis provides a comprehensive carbon footprint assessment covering
                        <strong>all building elements</strong> across the complete
                        <strong>${projectInfo.projectLife}-year lifecycle</strong>.
                    </p>
                </div>

                <div class="scope-breakdown-cards">
                    <div class="scope-card embodied-carbon">
                        <div class="scope-card-icon">🏗️</div>
                        <h3>Embodied Carbon</h3>
                        <div class="scope-value">${Math.round(totalCarbon.embodied).toLocaleString()} tonnes</div>
                        <p>Complete building structure, envelope, MEP systems, finishes, and site works</p>
                        <div class="scope-details">
                            <div class="detail-item">
                                <span class="detail-label">Specified Materials:</span>
                                <span class="detail-value">${Math.round(coverageAnalysis.specifiedMaterialsTotal).toLocaleString()} tonnes (${coverageAnalysis.specifiedMaterialsCoverage}%)</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Other Components:</span>
                                <span class="detail-value">${Math.round(coverageAnalysis.unspecifiedComponentsTotal).toLocaleString()} tonnes (${(100 - coverageAnalysis.specifiedMaterialsCoverage).toFixed(1)}%)</span>
                            </div>
                        </div>
                    </div>

                    <div class="scope-card operational-carbon">
                        <div class="scope-card-icon">⚡</div>
                        <h3>Operational Carbon</h3>
                        <div class="scope-value">${Math.round(totalCarbon.operational).toLocaleString()} tonnes</div>
                        <p>HVAC, lighting, equipment, hot water over ${projectInfo.projectLife} years</p>
                        <div class="scope-details">
                            ${this.data.operationalBreakdown ? `
                                <div class="detail-item">
                                    <span class="detail-label">HVAC:</span>
                                    <span class="detail-value">${Math.round(this.data.operationalBreakdown.hvac).toLocaleString()} tonnes</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Lighting:</span>
                                    <span class="detail-value">${Math.round(this.data.operationalBreakdown.lighting).toLocaleString()} tonnes</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Equipment:</span>
                                    <span class="detail-value">${Math.round(this.data.operationalBreakdown.equipment).toLocaleString()} tonnes</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="scope-note-box">
                    <h4>📊 About Material Coverage</h4>
                    <p>${coverageAnalysis.explanation}</p>
                    <p class="note-callout">
                        <strong>Why the difference?</strong> The specified materials represent key elements
                        selected for detailed analysis and optimization. The complete embodied carbon includes
                        comprehensive calculations for all building systems using industry standard methodologies
                        (EN 15978, NCC Section J).
                    </p>
                </div>

                <div class="scope-actions">
                    <button class="btn-secondary" onclick="this.showDetailedBreakdown()">
                        View Complete Component Breakdown
                    </button>
                    <button class="btn-secondary" onclick="this.exportComprehensiveReport()">
                        Export Comprehensive Report
                    </button>
                </div>

                ${this._renderCoverageTargetSelector()}
                ${this._renderLifecycleStageToggle()}
                ${this._renderAustralianContextToggle()}
            </div>
        `;
    }

    /**
     * Render material coverage target selector
     *
     * @private
     * @returns {string} HTML for coverage target selector
     */
    _renderCoverageTargetSelector() {
        const { coverageAnalysis } = this.data;
        const currentCoverage = coverageAnalysis.specifiedMaterialsCoverage;
        const targets = [15, 25, 50, 75, 90];

        const targetOptions = targets.map(target => `
            <button
                class="target-option ${currentCoverage >= target ? 'achieved' : 'not-achieved'}"
                onclick="dashboard.updateCoverageTarget(${target})"
                title="${currentCoverage >= target ? 'Target achieved' : 'Target not yet achieved'}"
            >
                <span class="target-value">${target}%</span>
                ${currentCoverage >= target ? '<span class="check-icon">✓</span>' : ''}
            </button>
        `).join('');

        return `
            <div class="coverage-target-selector advanced-feature">
                <h4>📊 Material Coverage Target</h4>
                <p class="feature-description">
                    Select your target percentage for detailed material analysis coverage:
                </p>

                <div class="target-options-grid">
                    ${targetOptions}
                </div>

                <div class="current-coverage-display">
                    <span class="coverage-label">Current Coverage:</span>
                    <span class="coverage-value ${currentCoverage >= this.coverageTarget ? 'target-met' : 'target-unmet'}">
                        ${currentCoverage.toFixed(1)}%
                    </span>
                    <span class="coverage-status">
                        ${currentCoverage >= this.coverageTarget
                ? '✓ Target achieved'
                : `↗ ${(this.coverageTarget - currentCoverage).toFixed(1)}% to target`}
                    </span>
                </div>

                <div class="coverage-guidance">
                    <div class="guidance-icon">💡</div>
                    <div class="guidance-content">
                        <strong>Industry Standards:</strong>
                        <ul>
                            <li><strong>15-25%:</strong> Concept design / early feasibility</li>
                            <li><strong>50%:</strong> Schematic design / planning approval</li>
                            <li><strong>75%:</strong> Detailed design / tender documentation</li>
                            <li><strong>90%:</strong> Construction documentation / as-built</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render lifecycle stage toggle
     *
     * @private
     * @returns {string} HTML for lifecycle stage toggle
     */
    _renderLifecycleStageToggle() {
        const stages = [
            { id: 'A1-A3', label: 'Product Stage', icon: '🏭', description: 'Raw material extraction and manufacturing' },
            { id: 'A4-A5', label: 'Construction', icon: '🚚', description: 'Transport and construction process' },
            { id: 'B1-B7', label: 'Use Phase', icon: '⚡', description: 'Operations, maintenance, replacements' },
            { id: 'C1-C4', label: 'End of Life', icon: '♻️', description: 'Deconstruction and waste processing' },
            { id: 'D', label: 'Beyond Boundary', icon: '🌱', description: 'Reuse, recovery, recycling benefits' }
        ];

        const stageButtons = stages.map(stage => `
            <button
                class="stage-option ${this.activeLifecycleStages.includes(stage.id) ? 'active' : 'inactive'}"
                onclick="dashboard.toggleLifecycleStage('${stage.id}')"
                title="${stage.description}"
            >
                <span class="stage-icon">${stage.icon}</span>
                <span class="stage-label">${stage.label}</span>
                <span class="stage-id">${stage.id}</span>
            </button>
        `).join('');

        return `
            <div class="lifecycle-stage-toggle advanced-feature">
                <h4>🔄 Lifecycle Stage Filter</h4>
                <p class="feature-description">
                    Toggle EN 15978 lifecycle stages to analyze specific phases:
                </p>

                <div class="stage-options-grid">
                    ${stageButtons}
                </div>

                <div class="stage-diagram">
                    <div class="diagram-title">EN 15978 Lifecycle Stages</div>
                    <div class="diagram-flow">
                        <span class="flow-item ${this.activeLifecycleStages.includes('A1-A3') ? 'active' : 'inactive'}">A1-A3</span>
                        <span class="flow-arrow">→</span>
                        <span class="flow-item ${this.activeLifecycleStages.includes('A4-A5') ? 'active' : 'inactive'}">A4-A5</span>
                        <span class="flow-arrow">→</span>
                        <span class="flow-item ${this.activeLifecycleStages.includes('B1-B7') ? 'active' : 'inactive'}">B1-B7</span>
                        <span class="flow-arrow">→</span>
                        <span class="flow-item ${this.activeLifecycleStages.includes('C1-C4') ? 'active' : 'inactive'}">C1-C4</span>
                        <span class="flow-arrow">→</span>
                        <span class="flow-item ${this.activeLifecycleStages.includes('D') ? 'active' : 'inactive'}">D</span>
                    </div>
                </div>

                <div class="stage-summary">
                    <span class="summary-label">Active Stages:</span>
                    <span class="summary-value">${this.activeLifecycleStages.length} of 5</span>
                    <button class="btn-link" onclick="dashboard.resetLifecycleStages()">Reset All</button>
                </div>
            </div>
        `;
    }

    /**
     * Render Australian context toggle
     *
     * @private
     * @returns {string} HTML for Australian context toggle
     */
    _renderAustralianContextToggle() {
        const { projectInfo } = this.data;

        return `
            <div class="australian-context-toggle advanced-feature">
                <h4>🇦🇺 Australian Intelligence Layer</h4>
                <p class="feature-description">
                    Toggle Australian-specific adjustments and regional intelligence:
                </p>

                <div class="toggle-switch-container">
                    <label class="toggle-switch">
                        <input
                            type="checkbox"
                            id="context-toggle"
                            ${this.australianContextEnabled ? 'checked' : ''}
                            onchange="dashboard.toggleAustralianContext(this.checked)"
                        />
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label ${this.australianContextEnabled ? 'enabled' : 'disabled'}">
                        ${this.australianContextEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>

                ${this.australianContextEnabled ? `
                    <div class="context-details-grid">
                        <div class="context-item">
                            <div class="context-icon">📍</div>
                            <div class="context-content">
                                <strong>Location Context</strong>
                                <span>${projectInfo.location.city || projectInfo.location.state.toUpperCase()}, ${projectInfo.location.state.toUpperCase()}</span>
                                <span class="context-detail">Climate Zone ${projectInfo.climateZone}</span>
                            </div>
                        </div>

                        <div class="context-item">
                            <div class="context-icon">🚚</div>
                            <div class="context-content">
                                <strong>Transport Adjustments</strong>
                                <span>Regional transport penalties applied</span>
                                <span class="context-detail">State-specific logistics factors</span>
                            </div>
                        </div>

                        <div class="context-item">
                            <div class="context-icon">🏛️</div>
                            <div class="context-content">
                                <strong>NCC Compliance</strong>
                                <span>Section J energy efficiency checking</span>
                                <span class="context-detail">Climate zone-specific requirements</span>
                            </div>
                        </div>

                        <div class="context-item">
                            <div class="context-icon">⚡</div>
                            <div class="context-content">
                                <strong>Grid Factors</strong>
                                <span>${projectInfo.location.state.toUpperCase()} electricity emission factors</span>
                                <span class="context-detail">State-specific renewable penetration</span>
                            </div>
                        </div>

                        <div class="context-item">
                            <div class="context-icon">🏭</div>
                            <div class="context-content">
                                <strong>Local Suppliers</strong>
                                <span>Regional material availability mapped</span>
                                <span class="context-detail">Optimized supply chain emissions</span>
                            </div>
                        </div>

                        <div class="context-item">
                            <div class="context-icon">⭐</div>
                            <div class="context-content">
                                <strong>NABERS Integration</strong>
                                <span>Australian rating system alignment</span>
                                <span class="context-detail">Building type-specific benchmarks</span>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="context-disabled-message">
                        <p>Australian intelligence layer is disabled. Generic international factors will be used.</p>
                        <p class="warning-text">⚠️ Results may not accurately reflect Australian building practices and regulations.</p>
                    </div>
                `}

                <div class="context-impact-summary">
                    <div class="impact-label">Australian Intelligence Impact:</div>
                    <div class="impact-value">
                        ${this.australianContextEnabled
                ? '<span class="positive">+15-25% accuracy improvement</span>'
                : '<span class="neutral">Standard calculations only</span>'}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Update coverage target
     *
     * @param {number} target - New coverage target percentage
     */
    updateCoverageTarget(target) {
        this.coverageTarget = target;
        console.log(`Coverage target updated to ${target}%`);
        // Re-render scope explanation section
        this._renderScopeExplanation();
    }

    /**
     * Toggle lifecycle stage
     *
     * @param {string} stageId - Stage ID to toggle
     */
    toggleLifecycleStage(stageId) {
        const index = this.activeLifecycleStages.indexOf(stageId);
        if (index > -1) {
            this.activeLifecycleStages.splice(index, 1);
        } else {
            this.activeLifecycleStages.push(stageId);
        }
        console.log(`Lifecycle stages updated: ${this.activeLifecycleStages.join(', ')}`);
        // Re-render affected sections
        this._renderScopeExplanation();
        this._renderLifecycleSection();
    }

    /**
     * Reset all lifecycle stages to active
     */
    resetLifecycleStages() {
        this.activeLifecycleStages = ['A1-A3', 'A4-A5', 'B1-B7', 'C1-C4', 'D'];
        console.log('All lifecycle stages reset to active');
        this._renderScopeExplanation();
        this._renderLifecycleSection();
    }

    /**
     * Toggle Australian context
     *
     * @param {boolean} enabled - Whether Australian context is enabled
     */
    toggleAustralianContext(enabled) {
        this.australianContextEnabled = enabled;
        console.log(`Australian intelligence layer ${enabled ? 'enabled' : 'disabled'}`);
        // Re-render affected sections
        this._renderScopeExplanation();
        this._renderSummarySection();
    }

    /**
     * Render carbon waterfall chart showing cumulative contributions
     *
     * @private
     * @returns {HTMLElement} Waterfall chart container
     */
    _renderCarbonWaterfallChart() {
        const { totalCarbon, materialsBreakdown, operationalBreakdown, coverageAnalysis } = this.data;

        const waterfallContainer = document.createElement('div');
        waterfallContainer.className = 'carbon-waterfall-container advanced-feature';

        // Calculate embodied carbon breakdown by category
        const embodiedByCategory = materialsBreakdown.reduce((acc, cat) => {
            acc[cat.category] = cat.totalCarbon;
            return acc;
        }, {});

        // Add unspecified components as a category
        embodiedByCategory['other-components'] = coverageAnalysis.unspecifiedComponentsTotal;

        // Build waterfall data
        const waterfallData = [];
        let runningTotal = 0;

        // Embodied carbon contributions
        Object.entries(embodiedByCategory).forEach(([category, value]) => {
            waterfallData.push({
                label: this._formatCategoryLabel(category),
                value: value,
                start: runningTotal,
                end: runningTotal + value,
                type: 'embodied',
                color: this.colors.embodied || '#4CAF50'
            });
            runningTotal += value;
        });

        // Add embodied subtotal
        waterfallData.push({
            label: 'Total Embodied Carbon',
            value: totalCarbon.embodied,
            start: 0,
            end: totalCarbon.embodied,
            type: 'subtotal',
            color: '#2196F3'
        });

        // Operational carbon contributions
        if (operationalBreakdown) {
            const opStartTotal = runningTotal;
            Object.entries(operationalBreakdown).forEach(([system, value]) => {
                if (system !== 'total' && system !== 'distribution' && value > 0) {
                    waterfallData.push({
                        label: this._formatSystemLabel(system),
                        value: value,
                        start: runningTotal,
                        end: runningTotal + value,
                        type: 'operational',
                        color: this.colors.operational || '#FF9800'
                    });
                    runningTotal += value;
                }
            });
        }

        // Add operational subtotal
        waterfallData.push({
            label: 'Total Operational Carbon',
            value: totalCarbon.operational,
            start: totalCarbon.embodied,
            end: totalCarbon.embodied + totalCarbon.operational,
            type: 'subtotal',
            color: '#2196F3'
        });

        // Add final total
        waterfallData.push({
            label: 'Whole-of-Life Total',
            value: totalCarbon.wholeOfLife,
            start: 0,
            end: totalCarbon.wholeOfLife,
            type: 'total',
            color: '#673AB7'
        });

        // Generate waterfall HTML
        const maxValue = totalCarbon.wholeOfLife;
        const waterfallBars = waterfallData.map((item, index) => {
            const startPercent = (item.start / maxValue) * 100;
            const widthPercent = (item.value / maxValue) * 100;

            return `
                <div class="waterfall-item ${item.type}" data-index="${index}">
                    <div class="waterfall-bar" style="
                        left: ${startPercent}%;
                        width: ${widthPercent}%;
                        background-color: ${item.color};
                    ">
                        <span class="bar-value">${Math.round(item.value).toLocaleString()}</span>
                    </div>
                    <div class="waterfall-label">${item.label}</div>
                </div>
            `;
        }).join('');

        waterfallContainer.innerHTML = `
            <div class="waterfall-header">
                <h4>📊 Carbon Contribution Waterfall Analysis</h4>
                <p class="feature-description">
                    Visual representation of how each component builds up to the total carbon footprint
                </p>
            </div>

            <div class="waterfall-chart">
                <div class="waterfall-axis">
                    <span class="axis-label">0</span>
                    <span class="axis-label">${Math.round(maxValue * 0.25).toLocaleString()}</span>
                    <span class="axis-label">${Math.round(maxValue * 0.5).toLocaleString()}</span>
                    <span class="axis-label">${Math.round(maxValue * 0.75).toLocaleString()}</span>
                    <span class="axis-label">${Math.round(maxValue).toLocaleString()} tonnes CO₂-e</span>
                </div>
                <div class="waterfall-bars">
                    ${waterfallBars}
                </div>
            </div>

            <div class="waterfall-legend">
                <div class="legend-item">
                    <span class="legend-color embodied" style="background-color: ${this.colors.embodied || '#4CAF50'}"></span>
                    <span class="legend-label">Embodied Carbon Components</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color operational" style="background-color: ${this.colors.operational || '#FF9800'}"></span>
                    <span class="legend-label">Operational Carbon Systems</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color subtotal" style="background-color: #2196F3"></span>
                    <span class="legend-label">Subtotals</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color total" style="background-color: #673AB7"></span>
                    <span class="legend-label">Final Total</span>
                </div>
            </div>
        `;

        return waterfallContainer;
    }

    /**
     * Format category label for display
     *
     * @private
     * @param {string} category - Category name
     * @returns {string} Formatted label
     */
    _formatCategoryLabel(category) {
        const labels = {
            'concrete': 'Concrete',
            'steel': 'Steel',
            'timber': 'Timber',
            'masonry': 'Masonry',
            'insulation': 'Insulation',
            'glazing': 'Glazing',
            'finishes': 'Finishes',
            'other-components': 'Other Building Components'
        };
        return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Format system label for display
     *
     * @private
     * @param {string} system - System name
     * @returns {string} Formatted label
     */
    _formatSystemLabel(system) {
        const labels = {
            'hvac': 'HVAC Systems',
            'lighting': 'Lighting',
            'equipment': 'Equipment & Appliances',
            'hotWater': 'Hot Water',
            'other': 'Other Systems'
        };
        return labels[system] || system.charAt(0).toUpperCase() + system.slice(1);
    }

    /**
     * Render the summary section with carbon breakdown
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderSummarySection() {
        const section = document.querySelector('#summary-section .section-content');
        const { totalCarbon, coverageAnalysis } = this.data;

        // Create hierarchical breakdown
        const hierarchyContainer = document.createElement('div');
        hierarchyContainer.className = 'carbon-hierarchy';

        hierarchyContainer.innerHTML = `
            <div class="breakdown-level-1">
                <div class="carbon-card total-carbon">
                    <div class="card-header">
                        <h3>Total Whole-of-Life Carbon</h3>
                        <span class="badge-info">Complete Lifecycle</span>
                    </div>
                    <div class="carbon-value-large">${Math.round(totalCarbon.wholeOfLife).toLocaleString()}</div>
                    <div class="carbon-unit">tonnes CO₂-e</div>
                    <div class="carbon-note">Full building, ${this.data.projectInfo.projectLife} years</div>
                </div>
            </div>

            <div class="breakdown-level-2">
                <div class="carbon-card embodied-card">
                    <div class="card-icon">🏗️</div>
                    <h3>Embodied Carbon</h3>
                    <div class="carbon-value">${Math.round(totalCarbon.embodied).toLocaleString()}</div>
                    <div class="carbon-unit">tonnes CO₂-e</div>
                    <div class="carbon-percentage">${Math.round(totalCarbon.embodied / totalCarbon.wholeOfLife * 100)}% of total</div>
                    <div class="carbon-note">All materials and processes</div>
                </div>

                <div class="carbon-card operational-card">
                    <div class="card-icon">⚡</div>
                    <h3>Operational Carbon</h3>
                    <div class="carbon-value">${Math.round(totalCarbon.operational).toLocaleString()}</div>
                    <div class="carbon-unit">tonnes CO₂-e</div>
                    <div class="carbon-percentage">${Math.round(totalCarbon.operational / totalCarbon.wholeOfLife * 100)}% of total</div>
                    <div class="carbon-note">${this.data.projectInfo.projectLife} year lifecycle</div>
                </div>
            </div>

            <div class="coverage-indicator-section">
                <h4>Material Coverage Analysis</h4>
                <div class="coverage-bar-container">
                    <div class="coverage-bar-fill" style="width: ${coverageAnalysis.specifiedMaterialsCoverage}%">
                        <span class="coverage-label">Specified Materials: ${coverageAnalysis.specifiedMaterialsCoverage}%</span>
                    </div>
                    <div class="coverage-bar-remaining">
                        <span class="coverage-label">Other Components: ${(100 - coverageAnalysis.specifiedMaterialsCoverage).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="coverage-explanation">
                    <p>
                        <strong>Specified Materials:</strong> ${Math.round(coverageAnalysis.specifiedMaterialsTotal).toLocaleString()} tonnes
                        (detailed in Materials Impact Analysis below)
                    </p>
                    <p>
                        <strong>Other Building Components:</strong> ${Math.round(coverageAnalysis.unspecifiedComponentsTotal).toLocaleString()} tonnes
                        (foundations, complete MEP systems, envelope, fit-out, site works)
                    </p>
                </div>
            </div>

            <div class="breakdown-level-3">
                <h4>Key Metrics</h4>
                <div class="metrics-grid">
                    <div class="stat-card">
                        <h3>Carbon Intensity</h3>
                        <div class="stat-value">${Math.round(totalCarbon.perSquareMeter.total).toLocaleString()}</div>
                        <div class="stat-unit">kg CO₂-e/m²</div>
                    </div>

                    <div class="stat-card">
                        <h3>Construction Impact</h3>
                        <div class="stat-value">${Math.round(totalCarbon.construction).toLocaleString()}</div>
                        <div class="stat-unit">tonnes CO₂-e</div>
                    </div>

                    <div class="stat-card">
                        <h3>Waste Impact</h3>
                        <div class="stat-value">${Math.round(totalCarbon.waste).toLocaleString()}</div>
                        <div class="stat-unit">tonnes CO₂-e</div>
                    </div>
                </div>
            </div>
        `;

        section.appendChild(hierarchyContainer);

        // Add waterfall chart for carbon contribution analysis
        const waterfallContainer = this._renderCarbonWaterfallChart();
        section.appendChild(waterfallContainer);

        // Create canvas for the breakdown chart
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const canvas = document.createElement('canvas');
        canvas.id = 'carbon-breakdown-chart';
        chartContainer.appendChild(canvas);
        section.appendChild(chartContainer);

        // Create the pie chart using Chart.js
        this.charts.carbonBreakdown = this._createPieChart(
            'carbon-breakdown-chart',
            {
                labels: ['Embodied', 'Operational', 'Construction', 'Waste'],
                datasets: [{
                    data: [
                        totalCarbon.embodied,
                        totalCarbon.operational,
                        totalCarbon.construction,
                        totalCarbon.waste
                    ],
                    backgroundColor: [
                        this.colors.embodied,
                        this.colors.operational,
                        this.colors.construction,
                        this.colors.waste
                    ]
                }]
            },
            {
                title: 'Carbon Footprint Breakdown',
                responsive: true,
                maintainAspectRatio: false
            }
        );
    }

    /**
     * Render the materials section with material impact analysis
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderMaterialsSection() {
        const section = document.querySelector('#materials-section .section-content');
        const { materialsBreakdown } = this.data;

        // Create grid layout for this section
        const grid = document.createElement('div');
        grid.className = 'grid-layout';

        // Left side: Materials breakdown chart
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const canvas = document.createElement('canvas');
        canvas.id = 'materials-breakdown-chart';
        chartContainer.appendChild(canvas);

        // Right side: Materials table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';

        // Create materials table
        const table = document.createElement('table');
        table.className = 'materials-table';

        // Add table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Material Category</th>
                <th>Carbon (tonnes CO₂-e)</th>
                <th>Percentage</th>
            </tr>
        `;
        table.appendChild(thead);

        // Add table body
        const tbody = document.createElement('tbody');

        // Add rows for each material category
        materialsBreakdown.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.category}</td>
                <td>${Math.round(category.totalCarbon).toLocaleString()}</td>
                <td>${category.percentage.toFixed(1)}%</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // Add both containers to the grid
        grid.appendChild(chartContainer);
        grid.appendChild(tableContainer);
        section.appendChild(grid);

        // Create the bar chart using Chart.js
        this.charts.materialsBreakdown = this._createBarChart(
            'materials-breakdown-chart',
            {
                labels: materialsBreakdown.map(m => m.category),
                datasets: [{
                    label: 'Embodied Carbon (tonnes CO₂-e)',
                    data: materialsBreakdown.map(m => Math.round(m.totalCarbon)),
                    backgroundColor: this._generateColorGradient(
                        this.colors.materialsStart,
                        this.colors.materialsEnd,
                        materialsBreakdown.length
                    )
                }]
            },
            {
                title: 'Materials Carbon Impact',
                responsive: true,
                maintainAspectRatio: false
            }
        );

        // Add heatmap visualization (simplified)
        const heatmapContainer = document.createElement('div');
        heatmapContainer.className = 'heatmap-container';
        heatmapContainer.innerHTML = '<h3>Material Impact Heat Map</h3>';

        const heatmap = document.createElement('div');
        heatmap.className = 'impact-heatmap';

        // Create heat map cells
        materialsBreakdown.forEach(category => {
            const percentage = category.percentage;
            const intensity = Math.min(100, percentage * 2); // Scale for visualization

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.style.width = `${percentage}%`;
            cell.style.backgroundColor = `rgba(220, 53, 69, ${intensity / 100})`;
            cell.title = `${category.category}: ${percentage.toFixed(1)}%`;

            const label = document.createElement('div');
            label.className = 'heatmap-label';
            label.textContent = category.category;

            cell.appendChild(label);
            heatmap.appendChild(cell);
        });

        heatmapContainer.appendChild(heatmap);
        section.appendChild(heatmapContainer);
    }

    /**
     * Render the lifecycle section with LCA stages analysis
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderLifecycleSection() {
        const section = document.querySelector('#lifecycle-section .section-content');
        const { lcaBreakdown } = this.data;

        // Create container for Sankey diagram
        const sankeyContainer = document.createElement('div');
        sankeyContainer.className = 'sankey-container';
        sankeyContainer.innerHTML = '<h3>Carbon Flow Sankey Diagram</h3>';

        // In a real implementation, this would create a Sankey diagram using D3.js or similar
        // For this example, we'll create a simplified visualization

        const sankeyVisualization = document.createElement('div');
        sankeyVisualization.className = 'sankey-visualization';
        sankeyVisualization.innerHTML = '<div class="sankey-placeholder">Interactive Sankey Diagram would render here</div>';
        sankeyContainer.appendChild(sankeyVisualization);

        section.appendChild(sankeyContainer);

        // Create bar chart for lifecycle stages
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const canvas = document.createElement('canvas');
        canvas.id = 'lifecycle-stages-chart';
        chartContainer.appendChild(canvas);
        section.appendChild(chartContainer);

        // Prepare stage data
        const stages = lcaBreakdown.stages;
        const stageLabels = {
            A1A3: 'Product Stage (A1-A3)',
            A4: 'Transport to Site (A4)',
            A5: 'Construction (A5)',
            B1B7: 'Use Stage (B1-B7)',
            C1C4: 'End of Life (C1-C4)',
            D: 'Benefits Beyond (D)'
        };

        const stageValues = Object.entries(stages).map(([key, value]) => ({
            stage: stageLabels[key] || key,
            value: value
        }));

        // Create the chart
        this.charts.lifecycleStages = this._createBarChart(
            'lifecycle-stages-chart',
            {
                labels: stageValues.map(s => s.stage),
                datasets: [{
                    label: 'Carbon (tonnes CO₂-e)',
                    data: stageValues.map(s => Math.round(s.value)),
                    backgroundColor: this._generateColorGradient(
                        this.colors.lifecycleStart,
                        this.colors.lifecycleEnd,
                        stageValues.length
                    )
                }]
            },
            {
                title: 'Lifecycle Stage Impact',
                responsive: true,
                maintainAspectRatio: false
            }
        );
    }

    /**
     * Render the compliance section with NCC and NABERS status
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderComplianceSection() {
        const section = document.querySelector('#compliance-section .section-content');
        const { compliance } = this.data;

        // Create compliance status cards
        const statusContainer = document.createElement('div');
        statusContainer.className = 'compliance-status';

        // NCC Compliance card
        const nccCard = document.createElement('div');
        nccCard.className = `compliance-card ${compliance.ncc.pass ? 'pass' : 'fail'}`;

        nccCard.innerHTML = `
            <h3>NCC Section J Compliance</h3>
            <div class="compliance-badge ${compliance.ncc.pass ? 'pass' : 'fail'}">
                ${compliance.ncc.pass ? 'PASS' : 'FAIL'}
            </div>
            <div class="compliance-details">
                <table class="compliance-table">
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(compliance.ncc.sections).map(([section, pass]) => `
                            <tr>
                                <td>${section.replace('_', '.')}</td>
                                <td class="${pass ? 'pass' : 'fail'}">${pass ? 'PASS' : 'FAIL'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // NABERS Rating card
        const nabersCard = document.createElement('div');
        nabersCard.className = 'compliance-card';

        const starsHTML = Array(6)
            .fill()
            .map((_, i) => {
                const filled = i < Math.floor(compliance.nabers.energy.stars);
                const half = !filled && (i === Math.floor(compliance.nabers.energy.stars)) &&
                    (compliance.nabers.energy.stars % 1 >= 0.5);

                return `<span class="star ${filled ? 'filled' : half ? 'half' : ''}">★</span>`;
            })
            .join('');

        nabersCard.innerHTML = `
            <h3>NABERS Energy Rating</h3>
            <div class="rating-value">${compliance.nabers.energy.stars.toFixed(1)} stars</div>
            <div class="star-rating">${starsHTML}</div>
            <div class="rating-grade">${compliance.nabers.energy.grade}</div>
        `;

        statusContainer.appendChild(nccCard);
        statusContainer.appendChild(nabersCard);
        section.appendChild(statusContainer);

        // Create canvas for compliance radar chart
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const canvas = document.createElement('canvas');
        canvas.id = 'compliance-radar-chart';
        chartContainer.appendChild(canvas);
        section.appendChild(chartContainer);

        // Create radar chart for compliance aspects
        this.charts.complianceRadar = this._createRadarChart(
            'compliance-radar-chart',
            {
                labels: [
                    'Thermal Performance',
                    'Glazing Performance',
                    'Building Sealing',
                    'Lighting Efficiency',
                    'Embodied Carbon',
                    'Energy Efficiency'
                ],
                datasets: [{
                    label: 'Project Performance',
                    data: [
                        compliance.ncc.sections.J1_2 ? 90 : 50,
                        compliance.ncc.sections.J1_3 ? 85 : 45,
                        compliance.ncc.sections.J1_5 ? 95 : 60,
                        compliance.ncc.sections.J1_6 ? 80 : 40,
                        compliance.ncc.sections.J5 ? 90 : 55,
                        compliance.nabers.energy.stars / 6 * 100
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2
                }, {
                    label: 'Compliance Threshold',
                    data: [70, 70, 70, 70, 70, 70],
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1,
                    borderDash: [5, 5]
                }]
            },
            {
                title: 'Compliance Performance',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        );
    }

    /**
     * Render the optimization section with recommendations
     *
     * @private
     * @returns {Promise<void>}
     */
    async _renderOptimizationSection() {
        const section = document.querySelector('#optimization-section .section-content');
        const { optimizations } = this.data;

        // Create header with summary stats
        const summaryHeader = document.createElement('div');
        summaryHeader.className = 'optimization-summary';

        summaryHeader.innerHTML = `
            <div class="summary-stat">
                <h3>Total Potential Savings</h3>
                <div class="stat-value">${Math.round(optimizations.totalPotentialSavings).toLocaleString()}</div>
                <div class="stat-unit">tonnes CO₂-e</div>
            </div>

            <div class="summary-stat">
                <h3>Percentage Reduction</h3>
                <div class="stat-value">${optimizations.savingsPercentage.toFixed(1)}</div>
                <div class="stat-unit">%</div>
            </div>
        `;

        section.appendChild(summaryHeader);

        // Create recommendations table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';

        const table = document.createElement('table');
        table.className = 'recommendations-table';

        // Add table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Recommendation</th>
                <th>Category</th>
                <th>Carbon Savings</th>
                <th>Cost Impact</th>
                <th>Implementation</th>
            </tr>
        `;
        table.appendChild(thead);

        // Add table body
        const tbody = document.createElement('tbody');

        // Add rows for top 10 recommendations
        optimizations.recommendations.slice(0, 10).forEach((rec, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}. ${rec.title}</td>
                <td>${rec.category}</td>
                <td>${Math.round(rec.carbonSavings).toLocaleString()} tonnes</td>
                <td>${rec.costImpact}</td>
                <td>${rec.implementation}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        section.appendChild(tableContainer);

        // Create canvas for optimization matrix
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const canvas = document.createElement('canvas');
        canvas.id = 'optimization-matrix-chart';
        chartContainer.appendChild(canvas);
        section.appendChild(chartContainer);

        // Prepare data for optimization scatter plot (implementation difficulty vs. impact)
        const implementationScores = {
            'Easy': 10,
            'Medium': 50,
            'Complex': 90
        };

        const costImpactScores = {
            'Savings': 10,
            'Neutral': 30,
            'Slight Increase': 50,
            'Moderate Increase': 70,
            'High Initial Cost': 90
        };

        const scatterData = optimizations.recommendations.map(rec => ({
            x: implementationScores[rec.implementation] || 50,
            y: costImpactScores[rec.costImpact] || 50,
            r: Math.sqrt(rec.carbonSavings) / 2 + 5, // Bubble size based on carbon savings
            recommendation: rec.title,
            savings: rec.carbonSavings,
            category: rec.category
        }));

        // Create bubble chart for optimization matrix
        this.charts.optimizationMatrix = this._createBubbleChart(
            'optimization-matrix-chart',
            {
                datasets: [{
                    label: 'Optimization Opportunities',
                    data: scatterData,
                    backgroundColor: this._generateCategoricalColors(
                        optimizations.recommendations.map(r => r.category),
                        0.7
                    )
                }]
            },
            {
                title: 'Optimization Matrix',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Implementation Difficulty'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                if (value === 10) return 'Easy';
                                if (value === 50) return 'Medium';
                                if (value === 90) return 'Complex';
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cost Impact'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                if (value === 10) return 'Savings';
                                if (value === 30) return 'Neutral';
                                if (value === 50) return 'Slight';
                                if (value === 70) return 'Moderate';
                                if (value === 90) return 'High';
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const data = context.raw;
                                return [
                                    data.recommendation,
                                    `Carbon Savings: ${Math.round(data.savings).toLocaleString()} tonnes CO₂-e`,
                                    `Category: ${data.category}`
                                ];
                            }
                        }
                    }
                }
            }
        );
    }

    /**
     * Create a pie chart
     *
     * @private
     * @param {string} canvasId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     * @returns {Object} Chart instance
     */
    _createPieChart(canvasId, data, options) {
        // In a real implementation, this would use Chart.js
        // For this example, we'll simulate chart creation

        console.log(`Creating pie chart: ${canvasId}`);
        console.log('Data:', data);
        console.log('Options:', options);

        // Simulate Chart.js instance
        return {
            type: 'pie',
            data: data,
            options: options
        };
    }

    /**
     * Create a bar chart
     *
     * @private
     * @param {string} canvasId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     * @returns {Object} Chart instance
     */
    _createBarChart(canvasId, data, options) {
        // In a real implementation, this would use Chart.js
        // For this example, we'll simulate chart creation

        console.log(`Creating bar chart: ${canvasId}`);
        console.log('Data:', data);
        console.log('Options:', options);

        // Simulate Chart.js instance
        return {
            type: 'bar',
            data: data,
            options: options
        };
    }

    /**
     * Create a radar chart
     *
     * @private
     * @param {string} canvasId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     * @returns {Object} Chart instance
     */
    _createRadarChart(canvasId, data, options) {
        // In a real implementation, this would use Chart.js
        // For this example, we'll simulate chart creation

        console.log(`Creating radar chart: ${canvasId}`);
        console.log('Data:', data);
        console.log('Options:', options);

        // Simulate Chart.js instance
        return {
            type: 'radar',
            data: data,
            options: options
        };
    }

    /**
     * Create a bubble chart
     *
     * @private
     * @param {string} canvasId - Canvas element ID
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     * @returns {Object} Chart instance
     */
    _createBubbleChart(canvasId, data, options) {
        // In a real implementation, this would use Chart.js
        // For this example, we'll simulate chart creation

        console.log(`Creating bubble chart: ${canvasId}`);
        console.log('Data:', data);
        console.log('Options:', options);

        // Simulate Chart.js instance
        return {
            type: 'bubble',
            data: data,
            options: options
        };
    }

    /**
     * Get theme colors based on selected theme
     *
     * @private
     * @param {string} theme - Dashboard theme name
     * @returns {Object} Theme colors
     */
    _getThemeColors(theme) {
        // Default colors
        const defaultColors = {
            embodied: 'rgba(54, 162, 235, 0.8)',
            operational: 'rgba(255, 99, 132, 0.8)',
            construction: 'rgba(255, 206, 86, 0.8)',
            waste: 'rgba(75, 192, 192, 0.8)',

            materialsStart: 'rgba(54, 162, 235, 1)',
            materialsEnd: 'rgba(25, 118, 210, 1)',

            lifecycleStart: 'rgba(255, 99, 132, 1)',
            lifecycleEnd: 'rgba(220, 53, 69, 1)'
        };

        // Theme-specific colors
        const themeColors = {
            'standard': defaultColors,

            'professional': {
                embodied: 'rgba(25, 118, 210, 0.8)',
                operational: 'rgba(220, 53, 69, 0.8)',
                construction: 'rgba(255, 193, 7, 0.8)',
                waste: 'rgba(40, 167, 69, 0.8)',

                materialsStart: 'rgba(25, 118, 210, 1)',
                materialsEnd: 'rgba(13, 71, 161, 1)',

                lifecycleStart: 'rgba(220, 53, 69, 1)',
                lifecycleEnd: 'rgba(137, 32, 44, 1)'
            },

            'minimal': {
                embodied: 'rgba(52, 58, 64, 0.8)',
                operational: 'rgba(108, 117, 125, 0.8)',
                construction: 'rgba(73, 80, 87, 0.8)',
                waste: 'rgba(173, 181, 189, 0.8)',

                materialsStart: 'rgba(52, 58, 64, 1)',
                materialsEnd: 'rgba(33, 37, 41, 1)',

                lifecycleStart: 'rgba(73, 80, 87, 1)',
                lifecycleEnd: 'rgba(52, 58, 64, 1)'
            }
        };

        return themeColors[theme] || defaultColors;
    }

    /**
     * Generate a color gradient array between two colors
     *
     * @private
     * @param {string} startColor - Starting color (rgba or hex)
     * @param {string} endColor - Ending color (rgba or hex)
     * @param {number} steps - Number of colors in the gradient
     * @returns {Array<string>} Array of color values
     */
    _generateColorGradient(startColor, endColor, steps) {
        // Parse colors to extract RGB components
        const parseColor = (color) => {
            if (color.startsWith('rgba')) {
                const parts = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                return {
                    r: parseInt(parts[1], 10),
                    g: parseInt(parts[2], 10),
                    b: parseInt(parts[3], 10),
                    a: parseFloat(parts[4])
                };
            } else if (color.startsWith('rgb')) {
                const parts = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                return {
                    r: parseInt(parts[1], 10),
                    g: parseInt(parts[2], 10),
                    b: parseInt(parts[3], 10),
                    a: 1
                };
            } else if (color.startsWith('#')) {
                const hex = color.substring(1);
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16),
                    a: 1
                };
            }

            // Default to black if color can't be parsed
            return { r: 0, g: 0, b: 0, a: 1 };
        };

        const start = parseColor(startColor);
        const end = parseColor(endColor);

        const gradient = [];

        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);

            const r = Math.round(start.r + ratio * (end.r - start.r));
            const g = Math.round(start.g + ratio * (end.g - start.g));
            const b = Math.round(start.b + ratio * (end.b - start.b));
            const a = start.a + ratio * (end.a - start.a);

            gradient.push(`rgba(${r}, ${g}, ${b}, ${a})`);
        }

        return gradient;
    }

    /**
     * Generate categorical colors based on unique categories
     *
     * @private
     * @param {Array<string>} categories - Category labels
     * @param {number} alpha - Color opacity (0-1)
     * @returns {Array<string>} Array of color values
     */
    _generateCategoricalColors(categories, alpha = 1) {
        // Base colors for categories
        const baseColors = [
            [25, 118, 210],   // blue
            [220, 53, 69],    // red
            [40, 167, 69],    // green
            [255, 193, 7],    // yellow
            [111, 66, 193],   // purple
            [23, 162, 184],   // teal
            [108, 117, 125],  // gray
            [253, 126, 20],   // orange
            [32, 201, 151],   // seafoam
            [233, 30, 99]     // pink
        ];

        // Get unique categories
        const uniqueCategories = [...new Set(categories)];

        // Map categories to colors
        const categoryColors = {};
        uniqueCategories.forEach((category, index) => {
            const colorIndex = index % baseColors.length;
            const [r, g, b] = baseColors[colorIndex];
            categoryColors[category] = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        });

        // Return colors in the same order as input categories
        return categories.map(category => categoryColors[category]);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarbonIntelligenceDashboard;
}