/**
 * CarbonIntelligence Dashboard
 *
 * Creates interactive visualizations of carbon footprint data
 * from the CarbonIntelligence core system.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

class CarbonIntelligenceDashboard {
    constructor(containerId, theme = 'professional') {
        this.containerId = containerId;
        this.theme = theme;
        this.data = null;
        this.charts = {};

        // Set color schemes based on theme
        this.setColorScheme(theme);

        console.log(`CarbonIntelligence Dashboard initialized with theme: ${theme}`);
    }

    /**
     * Render the dashboard with the provided data
     *
     * @param {Object} data - Carbon footprint data from CarbonIntelligenceCore
     * @param {Object} options - Optional rendering options
     */
    async render(data, options = {}) {
        this.data = data;
        this.options = {
            showSummary: true,
            showMaterialBreakdown: true,
            showOperationalBreakdown: true,
            showScopeBreakdown: true,
            showComplianceStatus: true,
            showOptimizations: true,
            responsive: true,
            interactive: true,
            exportable: true,
            ...options
        };

        // Clear container
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container with id "${this.containerId}" not found`);
        }
        container.innerHTML = '';

        // Create dashboard structure
        this._createDashboardStructure(container);

        // Render all sections
        await this._renderAllSections();

        console.log('Dashboard rendered successfully');

        // Return dashboard instance for chaining
        return this;
    }

    /**
     * Update dashboard with new data
     *
     * @param {Object} data - Updated carbon footprint data
     * @param {Boolean} animate - Whether to animate the transition
     */
    async update(data, animate = true) {
        this.data = data;

        // Update all visualizations
        for (const chartId in this.charts) {
            const chart = this.charts[chartId];
            if (chart && chart.update) {
                chart.update(animate ? 'default' : 'none');
            }
        }

        console.log('Dashboard updated successfully');

        // Return dashboard instance for chaining
        return this;
    }

    /**
     * Create the dashboard structure
     */
    _createDashboardStructure(container) {
        // Create dashboard wrapper
        const dashboard = document.createElement('div');
        dashboard.className = 'carbon-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <div class="project-info">
                    <h1>${this.data.projectInfo.name}</h1>
                    <div class="project-metadata">
                        <span><strong>Location:</strong> ${this._formatLocation(this.data.projectInfo.location)}</span>
                        <span><strong>GFA:</strong> ${this.data.projectInfo.gfa.toLocaleString()} m²</span>
                        <span><strong>Building Type:</strong> ${this._formatBuildingType(this.data.projectInfo.buildingType)}</span>
                        <span><strong>Climate Zone:</strong> ${this.data.climateData.zone} (${this.data.climateData.location})</span>
                    </div>
                </div>
                <div class="dashboard-actions">
                    ${this.options.exportable ? '<button class="export-button">Export Report</button>' : ''}
                    <div class="dashboard-logo">CarbonConstruct</div>
                </div>
            </div>

            <div class="dashboard-content">
                <div class="dashboard-section summary-section" id="carbon-summary"></div>

                <div class="dashboard-section materials-section" id="materials-breakdown"></div>

                <div class="dashboard-section operational-section" id="operational-breakdown"></div>

                <div class="dashboard-section scopes-section" id="scopes-breakdown"></div>

                <div class="dashboard-section compliance-section" id="compliance-status"></div>

                <div class="dashboard-section optimization-section" id="optimization-recommendations"></div>
            </div>
        `;

        // Add to container
        container.appendChild(dashboard);

        // Add event listeners
        if (this.options.exportable) {
            const exportButton = dashboard.querySelector('.export-button');
            exportButton.addEventListener('click', () => this.exportReport());
        }
    }

    /**
     * Render all dashboard sections
     */
    async _renderAllSections() {
        // Render each section
        if (this.options.showSummary) {
            await this._renderSummarySection();
        }

        if (this.options.showMaterialBreakdown) {
            await this._renderMaterialsSection();
        }

        if (this.options.showOperationalBreakdown) {
            await this._renderOperationalSection();
        }

        if (this.options.showScopeBreakdown) {
            await this._renderScopesSection();
        }

        if (this.options.showComplianceStatus) {
            await this._renderComplianceSection();
        }

        if (this.options.showOptimizations) {
            await this._renderOptimizationSection();
        }
    }

    /**
     * Render the summary section
     */
    async _renderSummarySection() {
        const container = document.getElementById('carbon-summary');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>Carbon Footprint Summary</h2>';
        container.appendChild(header);

        // Create summary cards
        const summaryGrid = document.createElement('div');
        summaryGrid.className = 'summary-grid';

        // Total carbon card
        const totalCarbon = document.createElement('div');
        totalCarbon.className = 'summary-card total-carbon';
        totalCarbon.innerHTML = `
            <div class="card-title">Total Carbon Footprint</div>
            <div class="card-value">${this.data.totalCarbon.wholeOfLife.toLocaleString()}</div>
            <div class="card-unit">tonnes CO₂-e</div>
            <div class="card-details">${(this.data.totalCarbon.perSquareMeter.total).toFixed(1)} kg CO₂-e/m²</div>
        `;
        summaryGrid.appendChild(totalCarbon);

        // Embodied carbon card
        const embodiedCarbon = document.createElement('div');
        embodiedCarbon.className = 'summary-card embodied-carbon';
        const embodiedPercentage = (this.data.totalCarbon.embodied / this.data.totalCarbon.wholeOfLife * 100).toFixed(0);
        embodiedCarbon.innerHTML = `
            <div class="card-title">Embodied Carbon</div>
            <div class="card-value">${this.data.totalCarbon.embodied.toLocaleString()}</div>
            <div class="card-unit">tonnes CO₂-e</div>
            <div class="card-details">${embodiedPercentage}% of total</div>
        `;
        summaryGrid.appendChild(embodiedCarbon);

        // Operational carbon card
        const operationalCarbon = document.createElement('div');
        operationalCarbon.className = 'summary-card operational-carbon';
        const operationalPercentage = (this.data.totalCarbon.operational / this.data.totalCarbon.wholeOfLife * 100).toFixed(0);
        operationalCarbon.innerHTML = `
            <div class="card-title">Operational Carbon</div>
            <div class="card-value">${this.data.totalCarbon.operational.toLocaleString()}</div>
            <div class="card-unit">tonnes CO₂-e</div>
            <div class="card-details">${operationalPercentage}% of total</div>
        `;
        summaryGrid.appendChild(operationalCarbon);

        // NABERS rating card
        const nabersRating = document.createElement('div');
        nabersRating.className = 'summary-card nabers-rating';
        nabersRating.innerHTML = `
            <div class="card-title">NABERS Energy Rating</div>
            <div class="card-value">${this.data.compliance.nabers.energy.stars.toFixed(1)}</div>
            <div class="card-unit">stars</div>
            <div class="card-details">${this.data.compliance.nabers.energy.grade}</div>
        `;
        summaryGrid.appendChild(nabersRating);

        // Add summary grid to container
        container.appendChild(summaryGrid);

        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.innerHTML = `<canvas id="carbon-summary-chart"></canvas>`;
        container.appendChild(chartContainer);

        // Create the chart
        const ctx = document.getElementById('carbon-summary-chart').getContext('2d');
        this.charts.summaryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Embodied Carbon', 'Operational Carbon'],
                datasets: [{
                    data: [
                        this.data.totalCarbon.embodied,
                        this.data.totalCarbon.operational
                    ],
                    backgroundColor: [
                        this.colors.embodied,
                        this.colors.operational
                    ],
                    borderColor: this.colors.background,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: '"Inter", sans-serif',
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} tonnes CO₂-e (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    /**
     * Render the materials breakdown section
     */
    async _renderMaterialsSection() {
        const container = document.getElementById('materials-breakdown');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>Materials Breakdown</h2>';
        container.appendChild(header);

        // Create charts container
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-container';

        // Create embodied carbon by category chart
        const categoryChartContainer = document.createElement('div');
        categoryChartContainer.className = 'chart-container half-width';
        categoryChartContainer.innerHTML = `
            <h3>Embodied Carbon by Category</h3>
            <canvas id="materials-category-chart"></canvas>
        `;
        chartsContainer.appendChild(categoryChartContainer);

        // Create embodied carbon by lifecycle stage chart
        const stageChartContainer = document.createElement('div');
        stageChartContainer.className = 'chart-container half-width';
        stageChartContainer.innerHTML = `
            <h3>Embodied Carbon by Lifecycle Stage</h3>
            <canvas id="materials-stage-chart"></canvas>
        `;
        chartsContainer.appendChild(stageChartContainer);

        // Add charts container to main container
        container.appendChild(chartsContainer);

        // Create the category chart
        await this._createMaterialsCategoryChart();

        // Create the lifecycle stage chart
        await this._createMaterialsStageChart();

        // Create materials table
        await this._createMaterialsTable(container);
    }

    /**
     * Create materials category chart
     */
    async _createMaterialsCategoryChart() {
        const categorized = this.data.materialBreakdown;

        // Prepare data
        const categories = Object.keys(categorized);
        const values = categories.map(category => categorized[category].embodiedCarbon);

        // Create color array based on categories
        const colors = categories.map((category, index) => {
            const colorMap = {
                concrete: this.colors.concrete,
                steel: this.colors.steel,
                timber: this.colors.timber,
                insulation: this.colors.insulation,
                glazing: this.colors.glazing,
                finishes: this.colors.finishes,
                other: this.colors.other
            };
            return colorMap[category] || this.colors.other;
        });

        const ctx = document.getElementById('materials-category-chart').getContext('2d');
        this.charts.materialsCategoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(cat => this._formatCategoryName(cat)),
                datasets: [{
                    label: 'Embodied Carbon',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors.map(color => this._adjustColor(color, -20)),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.x || 0;
                                return `${value.toLocaleString()} kg CO₂-e`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'kg CO₂-e'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create materials lifecycle stage chart
     */
    async _createMaterialsStageChart() {
        // Get stage data from first material as example
        // In a real implementation, this would aggregate all materials
        const materialResults = this.data.materialBreakdown;

        // Prepare stage data
        const stageData = {
            A1_A3: 0,
            A4_A5: 0,
            B1_B5: 0,
            C1_C4: 0,
            D: 0
        };

        // Aggregate stages across all materials
        for (const category in materialResults) {
            const categoryData = materialResults[category];
            if (categoryData.materials) {
                for (const material of categoryData.materials) {
                    if (material.lcaStages) {
                        stageData.A1_A3 += material.lcaStages.A1_A3 || 0;
                        stageData.A4_A5 += material.lcaStages.A4_A5 || 0;
                        stageData.B1_B5 += material.lcaStages.B1_B5 || 0;
                        stageData.C1_C4 += material.lcaStages.C1_C4 || 0;
                        stageData.D += material.lcaStages.D || 0;
                    }
                }
            }
        }

        const ctx = document.getElementById('materials-stage-chart').getContext('2d');
        this.charts.materialsStageChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'A1-A3 (Product)',
                    'A4-A5 (Construction)',
                    'B1-B5 (Use)',
                    'C1-C4 (End of Life)',
                    'D (Beyond Boundary)'
                ],
                datasets: [{
                    data: [
                        stageData.A1_A3,
                        stageData.A4_A5,
                        stageData.B1_B5,
                        stageData.C1_C4,
                        stageData.D
                    ],
                    backgroundColor: [
                        this.colors.stageA1A3,
                        this.colors.stageA4A5,
                        this.colors.stageB,
                        this.colors.stageC,
                        this.colors.stageD
                    ],
                    borderColor: this.colors.background,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: '"Inter", sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} kg CO₂-e (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create materials table
     */
    async _createMaterialsTable(container) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.innerHTML = `
            <h3>Materials Details</h3>
            <table class="materials-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Carbon Intensity</th>
                        <th>Total Carbon</th>
                    </tr>
                </thead>
                <tbody id="materials-table-body">
                </tbody>
            </table>
        `;

        container.appendChild(tableContainer);

        // Populate table
        const tableBody = document.getElementById('materials-table-body');

        // Flatten materials list for table
        const allMaterials = [];
        for (const category in this.data.materialBreakdown) {
            const categoryData = this.data.materialBreakdown[category];
            if (categoryData.materials) {
                for (const material of categoryData.materials) {
                    allMaterials.push({
                        category: category,
                        ...material
                    });
                }
            }
        }

        // Sort materials by total carbon impact
        allMaterials.sort((a, b) => b.totalCarbon - a.totalCarbon);

        // Add to table
        allMaterials.forEach(material => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this._formatCategoryName(material.category)}</td>
                <td>${this._formatMaterialName(material.name)}</td>
                <td>${material.quantity.toLocaleString()}</td>
                <td>${material.unit}</td>
                <td>${material.carbonIntensity.toFixed(2)}</td>
                <td>${material.totalCarbon.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Render the operational carbon section
     */
    async _renderOperationalSection() {
        const container = document.getElementById('operational-breakdown');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>Operational Carbon Breakdown</h2>';
        container.appendChild(header);

        // Create charts container
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-container';

        // Create operational carbon by end-use chart
        const endUseChartContainer = document.createElement('div');
        endUseChartContainer.className = 'chart-container half-width';
        endUseChartContainer.innerHTML = `
            <h3>Operational Carbon by End-Use</h3>
            <canvas id="operational-enduse-chart"></canvas>
        `;
        chartsContainer.appendChild(endUseChartContainer);

        // Create operational carbon by year chart
        const yearChartContainer = document.createElement('div');
        yearChartContainer.className = 'chart-container half-width';
        yearChartContainer.innerHTML = `
            <h3>Operational Carbon Over Time</h3>
            <canvas id="operational-year-chart"></canvas>
        `;
        chartsContainer.appendChild(yearChartContainer);

        // Add charts container to main container
        container.appendChild(chartsContainer);

        // Create the end-use chart
        await this._createOperationalEndUseChart();

        // Create the year chart
        await this._createOperationalYearChart();

        // Create operational details
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'operational-details';

        // Annual energy consumption
        const annualEnergy = document.createElement('div');
        annualEnergy.className = 'detail-card';
        annualEnergy.innerHTML = `
            <div class="card-title">Annual Energy Consumption</div>
            <div class="card-value">${this.data.operationalBreakdown.annual.energy.toLocaleString()}</div>
            <div class="card-unit">kWh/year</div>
            <div class="card-details">${this.data.operationalBreakdown.annual.intensity.toFixed(1)} kWh/m²/year</div>
        `;
        detailsContainer.appendChild(annualEnergy);

        // Annual carbon emissions
        const annualCarbon = document.createElement('div');
        annualCarbon.className = 'detail-card';
        annualCarbon.innerHTML = `
            <div class="card-title">Annual Carbon Emissions</div>
            <div class="card-value">${this.data.operationalBreakdown.annual.carbon.toLocaleString()}</div>
            <div class="card-unit">tonnes CO₂-e/year</div>
            <div class="card-details">Grid factor: ${this.data.operationalBreakdown.assumptions.gridEmissionFactor} kg CO₂-e/kWh</div>
        `;
        detailsContainer.appendChild(annualCarbon);

        // Add details container to main container
        container.appendChild(detailsContainer);
    }

    /**
     * Create operational end-use chart
     */
    async _createOperationalEndUseChart() {
        const endUseData = this.data.operationalBreakdown.breakdown.byEndUse;

        // Prepare data
        const categories = Object.keys(endUseData);
        const values = categories.map(category => endUseData[category]);

        // Create color array based on categories
        const colorMap = {
            hvac: this.colors.hvac,
            lighting: this.colors.lighting,
            equipment: this.colors.equipment,
            hotWater: this.colors.hotWater,
            cooking: this.colors.cooking,
            other: this.colors.other
        };

        const colors = categories.map(category => colorMap[category] || this.colors.other);

        const ctx = document.getElementById('operational-enduse-chart').getContext('2d');
        this.charts.operationalEndUseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => this._formatEndUseName(cat)),
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderColor: this.colors.background,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: '"Inter", sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value.toLocaleString()} kg CO₂-e`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create operational year chart
     */
    async _createOperationalYearChart() {
        // Generate yearly data based on annual carbon
        const annualCarbon = this.data.operationalBreakdown.annual.carbon;
        const projectLife = this.data.operationalBreakdown.assumptions.projectLife;

        // Create yearly data with a slight decrease over time (grid decarbonization)
        const years = [];
        const values = [];

        for (let i = 1; i <= projectLife; i++) {
            years.push(`Year ${i}`);
            // Assume 1.5% annual reduction in grid emissions
            const reduction = Math.pow(0.985, i - 1);
            values.push(annualCarbon * reduction);
        }

        const ctx = document.getElementById('operational-year-chart').getContext('2d');
        this.charts.operationalYearChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Carbon Emissions',
                    data: values,
                    fill: true,
                    backgroundColor: this._adjustColor(this.colors.operational, 50, 0.3),
                    borderColor: this.colors.operational,
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y || 0;
                                return `${value.toFixed(1)} tonnes CO₂-e`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            // Show every 5 years
                            maxTicksLimit: 10,
                            callback: function (value, index, values) {
                                // Show year labels for every 5th year
                                return index % 5 === 0 || index === values.length - 1 ? this.getLabelForValue(value) : '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'tonnes CO₂-e/year'
                        }
                    }
                }
            }
        });
    }

    /**
     * Render the scopes breakdown section
     */
    async _renderScopesSection() {
        const container = document.getElementById('scopes-breakdown');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>GHG Protocol Scopes Breakdown</h2>';
        container.appendChild(header);

        // Create charts container
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-container';

        // Create scopes summary chart
        const scopesSummaryContainer = document.createElement('div');
        scopesSummaryContainer.className = 'chart-container half-width';
        scopesSummaryContainer.innerHTML = `
            <h3>Emissions by Scope</h3>
            <canvas id="scopes-summary-chart"></canvas>
        `;
        chartsContainer.appendChild(scopesSummaryContainer);

        // Create scope 3 categories chart
        const scope3CategoriesContainer = document.createElement('div');
        scope3CategoriesContainer.className = 'chart-container half-width';
        scope3CategoriesContainer.innerHTML = `
            <h3>Scope 3 Categories</h3>
            <canvas id="scope3-categories-chart"></canvas>
        `;
        chartsContainer.appendChild(scope3CategoriesContainer);

        // Add charts container to main container
        container.appendChild(chartsContainer);

        // Create the scopes summary chart
        await this._createScopesSummaryChart();

        // Create the scope 3 categories chart
        await this._createScope3CategoriesChart();

        // Create scopes details tables
        await this._createScopesDetailsTables(container);
    }

    /**
     * Create scopes summary chart
     */
    async _createScopesSummaryChart() {
        const scopesData = this.data.scopesBreakdown;

        const ctx = document.getElementById('scopes-summary-chart').getContext('2d');
        this.charts.scopesSummaryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Scope 1 (Direct)',
                    'Scope 2 (Energy)',
                    'Scope 3 (Value Chain)'
                ],
                datasets: [{
                    data: [
                        scopesData.scope1.total,
                        scopesData.scope2.total,
                        scopesData.scope3.total
                    ],
                    backgroundColor: [
                        this.colors.scope1,
                        this.colors.scope2,
                        this.colors.scope3
                    ],
                    borderColor: this.colors.background,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: '"Inter", sans-serif',
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value.toLocaleString()} kg CO₂-e`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create scope 3 categories chart
     */
    async _createScope3CategoriesChart() {
        const scope3Data = this.data.scopesBreakdown.scope3.categories;

        // Prepare data
        const categories = Object.keys(scope3Data);
        const values = categories.map(category => scope3Data[category]);

        // Create color array based on categories
        const colors = categories.map((category, index) => {
            // Use a gradient of the scope3 color
            return this._adjustHue(this.colors.scope3, index * 20);
        });

        const ctx = document.getElementById('scope3-categories-chart').getContext('2d');
        this.charts.scope3CategoriesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(cat => this._formatScope3CategoryName(cat)),
                datasets: [{
                    label: 'Emissions',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors.map(color => this._adjustColor(color, -20)),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.x || 0;
                                return `${value.toLocaleString()} kg CO₂-e`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'kg CO₂-e'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create scopes details tables
     */
    async _createScopesDetailsTables(container) {
        const tablesContainer = document.createElement('div');
        tablesContainer.className = 'scopes-tables';

        // Create tabs for different scopes
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';
        tabsContainer.innerHTML = `
            <div class="tabs">
                <button class="tab-button active" data-tab="scope1">Scope 1</button>
                <button class="tab-button" data-tab="scope2">Scope 2</button>
                <button class="tab-button" data-tab="scope3">Scope 3</button>
            </div>
        `;

        // Create tab content
        const tabContentContainer = document.createElement('div');
        tabContentContainer.className = 'tab-content-container';

        // Scope 1 table
        const scope1Content = document.createElement('div');
        scope1Content.className = 'tab-content active';
        scope1Content.id = 'scope1-content';
        scope1Content.innerHTML = this._createScopeDetailsTable('Scope 1', this.data.scopesBreakdown.scope1);

        // Scope 2 table
        const scope2Content = document.createElement('div');
        scope2Content.className = 'tab-content';
        scope2Content.id = 'scope2-content';
        scope2Content.innerHTML = this._createScopeDetailsTable('Scope 2', this.data.scopesBreakdown.scope2);

        // Scope 3 table
        const scope3Content = document.createElement('div');
        scope3Content.className = 'tab-content';
        scope3Content.id = 'scope3-content';
        scope3Content.innerHTML = this._createScopeDetailsTable('Scope 3', this.data.scopesBreakdown.scope3);

        // Add tab content
        tabContentContainer.appendChild(scope1Content);
        tabContentContainer.appendChild(scope2Content);
        tabContentContainer.appendChild(scope3Content);

        // Add tabs and tab content to container
        tablesContainer.appendChild(tabsContainer);
        tablesContainer.appendChild(tabContentContainer);

        // Add tables container to main container
        container.appendChild(tablesContainer);

        // Add tab switching functionality
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and content
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContentContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
    }

    /**
     * Create scope details table HTML
     */
    _createScopeDetailsTable(scopeTitle, scopeData) {
        const categories = scopeData.categories;
        const total = scopeData.total;

        // Create table rows for categories
        let categoryRows = '';
        for (const category in categories) {
            const value = categories[category];
            const percentage = ((value / total) * 100).toFixed(1);
            categoryRows += `
                <tr>
                    <td>${this._formatScopeCategoryName(category)}</td>
                    <td>${value.toLocaleString()} kg CO₂-e</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }

        return `
            <h3>${scopeTitle} Details</h3>
            <table class="scope-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Emissions</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${categoryRows}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <th>${total.toLocaleString()} kg CO₂-e</th>
                        <th>100%</th>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    /**
     * Render the compliance section
     */
    async _renderComplianceSection() {
        const container = document.getElementById('compliance-status');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>Compliance Status</h2>';
        container.appendChild(header);

        // Create compliance cards
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'compliance-cards';

        // NCC Compliance card
        const nccCard = document.createElement('div');
        nccCard.className = `compliance-card ${this.data.compliance.ncc.pass ? 'pass' : 'fail'}`;
        nccCard.innerHTML = `
            <div class="compliance-header">
                <div class="compliance-title">NCC Section J</div>
                <div class="compliance-status">${this.data.compliance.ncc.pass ? '✓ PASS' : '✗ FAIL'}</div>
            </div>
            <div class="compliance-details">
                ${this._createNCCComplianceDetails()}
            </div>
        `;
        cardsContainer.appendChild(nccCard);

        // NABERS Compliance card
        const nabersCard = document.createElement('div');
        nabersCard.className = 'compliance-card pass';
        nabersCard.innerHTML = `
            <div class="compliance-header">
                <div class="compliance-title">NABERS Rating</div>
                <div class="compliance-status">${this.data.compliance.nabers.energy.stars.toFixed(1)} ★</div>
            </div>
            <div class="compliance-details">
                <div class="detail-row">
                    <span class="detail-label">Grade:</span>
                    <span class="detail-value">${this.data.compliance.nabers.energy.grade}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Energy Intensity:</span>
                    <span class="detail-value">${this.data.compliance.nabers.energy.energyIntensity.toFixed(1)} kWh/m²/year</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Benchmark:</span>
                    <span class="detail-value">${this.data.compliance.nabers.energy.benchmark.toFixed(1)} kWh/m²/year</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Performance:</span>
                    <span class="detail-value">${((1 - this.data.compliance.nabers.energy.energyIntensity / this.data.compliance.nabers.energy.benchmark) * 100).toFixed(1)}% better than benchmark</span>
                </div>
            </div>
        `;
        cardsContainer.appendChild(nabersCard);

        // Add cards container to main container
        container.appendChild(cardsContainer);
    }

    /**
     * Create NCC compliance details HTML
     */
    _createNCCComplianceDetails() {
        const nccData = this.data.compliance.ncc;
        let detailsHTML = '';

        for (const section in nccData.sections) {
            const sectionData = nccData.sections[section];
            const icon = sectionData.pass ? '✓' : '✗';
            const statusClass = sectionData.pass ? 'pass' : 'fail';

            detailsHTML += `
                <div class="detail-row ${statusClass}">
                    <span class="detail-icon">${icon}</span>
                    <span class="detail-label">${this._formatNCCSectionName(section)}:</span>
                    <span class="detail-value">
                        ${sectionData.achieved.toFixed(1)} / ${sectionData.required.toFixed(1)} ${sectionData.unit}
                        ${sectionData.pass ? '' : '(Gap: ' + (sectionData.required - sectionData.achieved).toFixed(1) + ')'}
                    </span>
                </div>
            `;
        }

        return detailsHTML;
    }

    /**
     * Render the optimization section
     */
    async _renderOptimizationSection() {
        const container = document.getElementById('optimization-recommendations');
        if (!container) return;

        // Create section header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = '<h2>Optimization Recommendations</h2>';
        container.appendChild(header);

        // Create optimization level tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';
        tabsContainer.innerHTML = `
            <div class="tabs">
                <button class="tab-button active" data-level="conservative">Conservative</button>
                <button class="tab-button" data-level="balanced">Balanced</button>
                <button class="tab-button" data-level="aggressive">Aggressive</button>
            </div>
        `;
        container.appendChild(tabsContainer);

        // Create optimization content
        const optimizationContent = document.createElement('div');
        optimizationContent.className = 'optimization-content';

        // Create optimization cards for each level
        for (const level in this.data.optimizations) {
            const levelData = this.data.optimizations[level];
            const levelCard = document.createElement('div');
            levelCard.className = `optimization-level ${level === 'conservative' ? 'active' : ''}`;
            levelCard.id = `optimization-${level}`;

            // Create recommendations list
            let recommendationsHTML = '';
            for (const recommendation of levelData.recommendations) {
                recommendationsHTML += `
                    <div class="recommendation-card">
                        <div class="recommendation-header">
                            <h4>${recommendation.name}</h4>
                            <span class="recommendation-priority ${recommendation.priority.toLowerCase()}">${recommendation.priority}</span>
                        </div>
                        <p class="recommendation-description">${recommendation.description}</p>
                        <div class="recommendation-details">
                            <div class="detail">
                                <span class="detail-label">Savings:</span>
                                <span class="detail-value">${recommendation.savings.toLocaleString()} kg CO₂-e</span>
                            </div>
                            <div class="detail">
                                <span class="detail-label">Cost Impact:</span>
                                <span class="detail-value">${recommendation.costImpact}</span>
                            </div>
                            <div class="detail">
                                <span class="detail-label">Implementation:</span>
                                <span class="detail-value">${recommendation.implementation}</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            levelCard.innerHTML = `
                <div class="level-summary">
                    <h3>${this._formatOptimizationLevel(level)}</h3>
                    <div class="summary-stats">
                        <div class="stat">
                            <span class="stat-label">Potential Savings:</span>
                            <span class="stat-value">${levelData.totalPotentialSavings.toLocaleString()} kg CO₂-e</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Reduction:</span>
                            <span class="stat-value">${((levelData.totalPotentialSavings / this.data.totalCarbon.wholeOfLife) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="recommendations-list">
                    ${recommendationsHTML}
                </div>
            `;

            optimizationContent.appendChild(levelCard);
        }

        container.appendChild(optimizationContent);

        // Add tab switching functionality
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and levels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                optimizationContent.querySelectorAll('.optimization-level').forEach(level => {
                    level.classList.remove('active');
                });

                // Add active class to clicked button and corresponding level
                button.classList.add('active');
                const levelId = button.getAttribute('data-level');
                document.getElementById(`optimization-${levelId}`).classList.add('active');
            });
        });
    }

    /**
     * Export the report as PDF
     */
    exportReport() {
        console.log('Exporting report as PDF...');
        // TODO: Implement PDF export functionality
        alert('PDF export functionality coming soon!');
    }

    /**
     * Format location object to string
     */
    _formatLocation(location) {
        if (typeof location === 'string') {
            return location;
        }

        if (location.city && location.state) {
            return `${location.city}, ${location.state}`;
        }

        if (location.state) {
            return location.state;
        }

        return 'Unknown';
    }

    /**
     * Format building type to display name
     */
    _formatBuildingType(type) {
        const typeMap = {
            office: 'Office',
            residential: 'Residential',
            retail: 'Retail',
            industrial: 'Industrial',
            education: 'Education',
            healthcare: 'Healthcare',
            hospitality: 'Hospitality',
            mixed: 'Mixed Use'
        };
        return typeMap[type] || type;
    }

    /**
     * Format category name
     */
    _formatCategoryName(category) {
        const categoryMap = {
            concrete: 'Concrete',
            steel: 'Steel',
            timber: 'Timber',
            masonry: 'Masonry',
            insulation: 'Insulation',
            glazing: 'Glazing',
            finishes: 'Finishes',
            other: 'Other'
        };
        return categoryMap[category] || category;
    }

    /**
     * Format material name
     */
    _formatMaterialName(material) {
        return material
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Format end use name
     */
    _formatEndUseName(endUse) {
        const endUseMap = {
            hvac: 'HVAC',
            lighting: 'Lighting',
            equipment: 'Equipment',
            hotWater: 'Hot Water',
            cooking: 'Cooking',
            elevators: 'Elevators',
            other: 'Other'
        };
        return endUseMap[endUse] || endUse;
    }

    /**
     * Format scope 3 category name
     */
    _formatScope3CategoryName(category) {
        const categoryMap = {
            purchasedGoods: 'Purchased Goods',
            capitalGoods: 'Capital Goods',
            fuelEnergy: 'Fuel & Energy',
            transport: 'Transport',
            waste: 'Waste',
            businessTravel: 'Business Travel',
            employeeCommuting: 'Employee Commuting',
            other: 'Other'
        };
        return categoryMap[category] || category;
    }

    /**
     * Format scope category name
     */
    _formatScopeCategoryName(category) {
        const categoryMap = {
            // Scope 1
            stationaryCombustion: 'Stationary Combustion',
            mobileCombustion: 'Mobile Combustion',
            fugitiveEmissions: 'Fugitive Emissions',
            // Scope 2
            electricity: 'Electricity',
            steam: 'Steam',
            heating: 'Heating',
            cooling: 'Cooling',
            // Scope 3
            purchasedGoods: 'Purchased Goods',
            capitalGoods: 'Capital Goods',
            fuelEnergy: 'Fuel & Energy',
            transport: 'Transport',
            waste: 'Waste',
            businessTravel: 'Business Travel',
            employeeCommuting: 'Employee Commuting',
            other: 'Other'
        };
        return categoryMap[category] || category;
    }

    /**
     * Format NCC section name
     */
    _formatNCCSectionName(section) {
        const sectionMap = {
            buildingFabric: 'Building Fabric',
            glazing: 'Glazing',
            airInfiltration: 'Air Infiltration',
            hvacEfficiency: 'HVAC Efficiency',
            lighting: 'Lighting',
            hotWater: 'Hot Water',
            renewable: 'Renewable Energy',
            commissioning: 'Commissioning'
        };
        return sectionMap[section] || section;
    }

    /**
     * Format optimization level
     */
    _formatOptimizationLevel(level) {
        const levelMap = {
            conservative: 'Conservative Optimizations',
            balanced: 'Balanced Optimizations',
            aggressive: 'Aggressive Optimizations'
        };
        return levelMap[level] || level;
    }

    /**
     * Set color scheme based on theme
     */
    setColorScheme(theme) {
        const themes = {
            professional: {
                background: '#ffffff',
                text: '#1a1a1a',
                primary: '#2563eb',
                secondary: '#64748b',
                embodied: '#ef4444',
                operational: '#3b82f6',

                // Materials
                concrete: '#94a3b8',
                steel: '#475569',
                timber: '#92400e',
                insulation: '#fbbf24',
                glazing: '#06b6d4',
                finishes: '#a855f7',
                other: '#6b7280',

                // Lifecycle stages
                stageA1A3: '#ef4444',
                stageA4A5: '#f97316',
                stageB: '#eab308',
                stageC: '#84cc16',
                stageD: '#22c55e',

                // Operational
                hvac: '#3b82f6',
                lighting: '#fbbf24',
                equipment: '#8b5cf6',
                hotWater: '#ef4444',
                cooking: '#f97316',

                // Scopes
                scope1: '#ef4444',
                scope2: '#f97316',
                scope3: '#eab308'
            },
            modern: {
                background: '#0f172a',
                text: '#f1f5f9',
                primary: '#06b6d4',
                secondary: '#64748b',
                embodied: '#f43f5e',
                operational: '#0ea5e9',

                // Materials
                concrete: '#64748b',
                steel: '#334155',
                timber: '#78350f',
                insulation: '#f59e0b',
                glazing: '#06b6d4',
                finishes: '#a855f7',
                other: '#475569',

                // Lifecycle stages
                stageA1A3: '#f43f5e',
                stageA4A5: '#fb923c',
                stageB: '#facc15',
                stageC: '#a3e635',
                stageD: '#4ade80',

                // Operational
                hvac: '#0ea5e9',
                lighting: '#fbbf24',
                equipment: '#a78bfa',
                hotWater: '#f43f5e',
                cooking: '#fb923c',

                // Scopes
                scope1: '#f43f5e',
                scope2: '#fb923c',
                scope3: '#facc15'
            },
            earth: {
                background: '#fefce8',
                text: '#1c1917',
                primary: '#65a30d',
                secondary: '#78716c',
                embodied: '#b91c1c',
                operational: '#0284c7',

                // Materials
                concrete: '#a8a29e',
                steel: '#57534e',
                timber: '#92400e',
                insulation: '#f59e0b',
                glazing: '#0891b2',
                finishes: '#a855f7',
                other: '#78716c',

                // Lifecycle stages
                stageA1A3: '#dc2626',
                stageA4A5: '#ea580c',
                stageB: '#ca8a04',
                stageC: '#65a30d',
                stageD: '#16a34a',

                // Operational
                hvac: '#0284c7',
                lighting: '#f59e0b',
                equipment: '#9333ea',
                hotWater: '#dc2626',
                cooking: '#ea580c',

                // Scopes
                scope1: '#dc2626',
                scope2: '#ea580c',
                scope3: '#ca8a04'
            }
        };

        this.colors = themes[theme] || themes.professional;
    }

    /**
     * Adjust color brightness
     *
     * @param {String} color - Hex color code
     * @param {Number} amount - Amount to lighten (positive) or darken (negative)
     * @param {Number} opacity - Optional opacity value (0-1)
     * @returns {String} - Adjusted color
     */
    _adjustColor(color, amount, opacity) {
        const clamp = (num) => Math.min(Math.max(num, 0), 255);

        const num = parseInt(color.replace('#', ''), 16);
        const r = clamp((num >> 16) + amount);
        const g = clamp(((num >> 8) & 0x00FF) + amount);
        const b = clamp((num & 0x0000FF) + amount);

        if (opacity !== undefined) {
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }

        return '#' + (
            0x1000000 +
            r * 0x10000 +
            g * 0x100 +
            b
        ).toString(16).slice(1);
    }

    /**
     * Adjust color hue
     *
     * @param {String} color - Hex color code
     * @param {Number} degrees - Degrees to rotate hue
     * @returns {String} - Adjusted color
     */
    _adjustHue(color, degrees) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = (num >> 16) / 255;
        const g = ((num >> 8) & 0x00FF) / 255;
        const b = (num & 0x0000FF) / 255;

        // Convert RGB to HSL
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        // Adjust hue
        h = (h * 360 + degrees) % 360 / 360;

        // Convert back to RGB
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r2, g2, b2;
        if (s === 0) {
            r2 = g2 = b2 = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r2 = hue2rgb(p, q, h + 1 / 3);
            g2 = hue2rgb(p, q, h);
            b2 = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarbonIntelligenceDashboard;
}
