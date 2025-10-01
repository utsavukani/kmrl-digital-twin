// KMRL Digital Twin Application
class KMRLDigitalTwin {
    constructor() {
        this.currentView = 'dashboard';
        this.charts = {};
        this.simulationRunning = false;
        this.zoomLevel = 1;
        this.selectedTrain = null;
        
        // Enhanced KMRL data structure
        this.data = {
            meta: {
                version: "1.0",
                system: "KMRL Digital Twin",
                coverage: "Phase 1 - Aluva to Tripunithura",
                total_length_km: 27.96
            },
            stations: [
                {id: 1, name: "Aluva", code: "ALV", chainage: 0.098, lat: 10.1098, lon: 76.3496, type: "terminal", height: 12.5, status: "operational", passengers: 450},
                {id: 2, name: "Pulinchodu", code: "PLN", chainage: 1.827, lat: 10.095120, lon: 76.346661, type: "intermediate", height: 12.5, status: "operational", passengers: 120},
                {id: 3, name: "Companypady", code: "CMP", chainage: 2.796, lat: 10.087293, lon: 76.342840, type: "intermediate", height: 12.5, status: "operational", passengers: 89},
                {id: 6, name: "Kalamassery", code: "KLM", chainage: 6.768, lat: 10.058400, lon: 76.321926, type: "interchange", height: 12.5, status: "operational", passengers: 320},
                {id: 11, name: "Palarivattom", code: "PLR", chainage: 13.071, lat: 10.015, lon: 76.295, type: "intermediate", height: 12.5, status: "operational", passengers: 280},
                {id: 14, name: "Town Hall", code: "TNH", chainage: 15.711, lat: 10.0, lon: 76.28, type: "intermediate", height: 12.5, status: "operational", passengers: 380},
                {id: 15, name: "M.G Road", code: "MGR", chainage: 16.899, lat: 9.995, lon: 76.275, type: "intermediate", height: 12.5, status: "operational", passengers: 420},
                {id: 20, name: "Vyttila", code: "VYT", chainage: 22.447, lat: 9.97, lon: 76.25, type: "intermediate", height: 12.5, status: "operational", passengers: 350},
                {id: 25, name: "Tripunithura", code: "TRP", chainage: 27.96, lat: 9.945, lon: 76.225, type: "terminal", height: 12.5, status: "operational", passengers: 290}
            ],
            trains: [
                {id: "KMRL-001", status: "in_service", current_station: 5, speed: 45, health: 95, mileage: 125000, branding: {advertiser: "Kerala Tourism", hours_remaining: 72}, doors: 98, braking: 96, hvac: 94},
                {id: "KMRL-002", status: "maintenance", current_station: 0, speed: 0, health: 87, mileage: 180000, branding: {advertiser: null, hours_remaining: 0}, doors: 85, braking: 88, hvac: 90},
                {id: "KMRL-003", status: "in_service", current_station: 12, speed: 65, health: 92, mileage: 95000, branding: {advertiser: "Samsung", hours_remaining: 45}, doors: 93, braking: 95, hvac: 89},
                {id: "KMRL-004", status: "standby", current_station: 0, speed: 0, health: 89, mileage: 150000, branding: {advertiser: "Coca-Cola", hours_remaining: 89}, doors: 91, braking: 87, hvac: 92}
            ],
            operations: {
                total_trains: 25,
                active_trains: 18,
                passenger_load: 22500,
                daily_ridership: 85000,
                punctuality: 98.2,
                incidents: 0,
                weather: {condition: "sunny", temperature: 28, humidity: 85},
                revenue: 145000,
                energy_consumption: 2400
            },
            depot: {
                name: "Muttom Depot",
                total_capacity: 15,
                current_occupancy: 12,
                maintenance_bays: 4,
                cleaning_bays: 3,
                staff_current: 45,
                staff_total: 60
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.initializeDashboard();
        this.startRealTimeUpdates();
        // Initialize clock immediately and set interval
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Route map controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoomMap(1.2));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoomMap(0.8));
        document.getElementById('resetView')?.addEventListener('click', () => this.resetMapView());

        // Fleet controls
        document.getElementById('fleetFilter')?.addEventListener('change', (e) => this.filterFleet(e.target.value));
        document.getElementById('refreshFleet')?.addEventListener('click', () => this.refreshFleetData());

        // Modal controls
        document.getElementById('closeTrainModal')?.addEventListener('click', () => this.closeModal('trainDetailsModal'));

        // Simulation controls
        document.getElementById('runSimulation')?.addEventListener('click', () => this.runSimulation());
        document.getElementById('resetSimulation')?.addEventListener('click', () => this.resetSimulation());
        document.getElementById('scenarioType')?.addEventListener('change', (e) => this.updateScenarioOptions(e.target.value));
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false
        });
        const dateString = now.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const clockElement = document.getElementById('currentTime');
        if (clockElement) {
            clockElement.innerHTML = `${dateString}<br>${timeString}`;
        }
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewName)?.classList.add('active');

        this.currentView = viewName;

        // Initialize view-specific content
        switch(viewName) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'route-map':
                this.initializeRouteMap();
                break;
            case 'train-fleet':
                this.initializeTrainFleet();
                break;
            case 'depot':
                this.initializeDepot();
                break;
            case 'maintenance':
                this.initializeMaintenance();
                break;
            case 'simulation':
                this.initializeSimulation();
                break;
            case 'analytics':
                this.initializeAnalytics();
                break;
        }
    }

    initializeDashboard() {
        this.updateMetrics();
        this.updateSystemStatus();
        this.updateWeatherInfo();
        this.updateIncidents();
        this.createSystemOverviewChart();
    }

    updateMetrics() {
        const metrics = {
            totalTrains: this.data.operations.total_trains,
            activeTrains: this.data.operations.active_trains,
            passengerLoad: this.data.operations.passenger_load.toLocaleString(),
            punctuality: this.data.operations.punctuality + '%'
        };

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.textContent = value;
        });
    }

    updateSystemStatus() {
        const statusList = document.getElementById('statusList');
        if (!statusList) return;

        const statuses = [
            { label: 'Train Operations', status: 'Operational', class: 'success' },
            { label: 'Power Supply', status: 'Normal', class: 'success' },
            { label: 'Communication', status: 'Active', class: 'success' },
            { label: 'Safety Systems', status: 'Online', class: 'success' },
            { label: 'Ticketing', status: 'Operational', class: 'success' }
        ];

        statusList.innerHTML = statuses.map(item => `
            <div class="status-item">
                <span>${item.label}</span>
                <span class="status status--${item.class}">${item.status}</span>
            </div>
        `).join('');
    }

    updateWeatherInfo() {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo) return;

        const weather = this.data.operations.weather;
        const icons = {
            sunny: '☀️',
            cloudy: '☁️',
            rainy: '🌧️',
            stormy: '⛈️'
        };

        weatherInfo.innerHTML = `
            <div class="weather-icon">${icons[weather.condition] || '☀️'}</div>
            <div class="weather-details">
                <div class="weather-condition">${weather.condition}</div>
                <div class="weather-temp">${weather.temperature}°C • Humidity: ${weather.humidity}%</div>
            </div>
        `;
    }

    updateIncidents() {
        const incidentsList = document.getElementById('incidentsList');
        if (!incidentsList) return;

        if (this.data.operations.incidents === 0) {
            incidentsList.innerHTML = `
                <div class="status-item">
                    <span>No active incidents</span>
                    <span class="status status--success">All Clear</span>
                </div>
            `;
        }
    }

    createSystemOverviewChart() {
        const ctx = document.getElementById('systemOverviewChart');
        if (!ctx) return;

        if (this.charts.systemOverview) {
            this.charts.systemOverview.destroy();
        }

        this.charts.systemOverview = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active Trains', 'Maintenance', 'Standby'],
                datasets: [{
                    data: [18, 4, 3],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2,
                    borderColor: '#1a1f2e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    initializeRouteMap() {
        const routeMap = document.getElementById('routeMap');
        const stationsContainer = document.getElementById('stationsContainer');
        const trainsContainer = document.getElementById('trainsContainer');
        if (!routeMap || !stationsContainer || !trainsContainer) return;

        // Clear existing content
        stationsContainer.innerHTML = '';
        trainsContainer.innerHTML = '';

        // Render stations
        this.data.stations.forEach((station, index) => {
            const stationElement = document.createElement('div');
            stationElement.className = `station ${station.type}`;
            stationElement.style.left = `${5 + (index * 90 / (this.data.stations.length - 1))}%`;
            stationElement.style.top = '50%';
            stationElement.title = `${station.name} (${station.code})`;
            
            stationElement.addEventListener('click', () => this.showStationDetails(station));

            const label = document.createElement('div');
            label.className = 'station-label';
            label.textContent = station.code;
            stationElement.appendChild(label);

            stationsContainer.appendChild(stationElement);
        });

        // Render trains
        this.data.trains.filter(train => train.status === 'in_service').forEach(train => {
            const trainElement = document.createElement('div');
            trainElement.className = 'train-marker';
            
            // Position train based on current station
            const stationIndex = Math.min(train.current_station, this.data.stations.length - 1);
            trainElement.style.left = `${5 + (stationIndex * 90 / (this.data.stations.length - 1))}%`;
            trainElement.style.top = '50%';
            trainElement.title = `${train.id} - Speed: ${train.speed} km/h`;
            
            trainElement.addEventListener('click', () => this.showTrainDetails(train));
            trainsContainer.appendChild(trainElement);
        });
    }

    showStationDetails(station) {
        const stationDetails = document.getElementById('stationDetails');
        if (!stationDetails) return;

        stationDetails.innerHTML = `
            <h4>${station.name} Station (${station.code})</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 16px;">
                <div>
                    <div class="metric-label">Type</div>
                    <div class="metric-value" style="font-size: 1rem;">${station.type}</div>
                </div>
                <div>
                    <div class="metric-label">Status</div>
                    <div class="status status--success">${station.status}</div>
                </div>
                <div>
                    <div class="metric-label">Current Passengers</div>
                    <div class="metric-value" style="font-size: 1rem;">${station.passengers || 0}</div>
                </div>
                <div>
                    <div class="metric-label">Platform Height</div>
                    <div class="metric-value" style="font-size: 1rem;">${station.height}m</div>
                </div>
            </div>
        `;
    }

    zoomMap(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel));
        
        const routeMap = document.getElementById('routeMap');
        if (routeMap) {
            routeMap.style.transform = `scale(${this.zoomLevel})`;
        }
    }

    resetMapView() {
        this.zoomLevel = 1;
        const routeMap = document.getElementById('routeMap');
        if (routeMap) {
            routeMap.style.transform = 'scale(1)';
        }
    }

    initializeTrainFleet() {
        this.renderFleetGrid();
    }

    renderFleetGrid(filter = 'all') {
        const fleetGrid = document.getElementById('fleetGrid');
        if (!fleetGrid) return;

        let trains = this.data.trains;
        if (filter !== 'all') {
            trains = trains.filter(train => train.status === filter);
        }

        // Generate additional trains to show full fleet
        const allTrains = [];
        for (let i = 1; i <= this.data.operations.total_trains; i++) {
            const existingTrain = trains.find(t => t.id === `KMRL-${i.toString().padStart(3, '0')}`);
            if (existingTrain) {
                allTrains.push(existingTrain);
            } else {
                allTrains.push({
                    id: `KMRL-${i.toString().padStart(3, '0')}`,
                    status: Math.random() > 0.7 ? 'in_service' : (Math.random() > 0.5 ? 'standby' : 'maintenance'),
                    current_station: Math.floor(Math.random() * this.data.stations.length),
                    speed: Math.random() > 0.7 ? Math.floor(Math.random() * 80) : 0,
                    health: 85 + Math.floor(Math.random() * 15),
                    mileage: 50000 + Math.floor(Math.random() * 200000),
                    branding: { advertiser: null, hours_remaining: 0 },
                    doors: 85 + Math.floor(Math.random() * 15),
                    braking: 85 + Math.floor(Math.random() * 15),
                    hvac: 85 + Math.floor(Math.random() * 15)
                });
            }
        }

        const filteredTrains = filter === 'all' ? allTrains : allTrains.filter(train => train.status === filter);

        fleetGrid.innerHTML = filteredTrains.map(train => `
            <div class="train-card" onclick="kmrlApp.showTrainModal('${train.id}')">
                <div class="train-header">
                    <div class="train-id">${train.id}</div>
                    <div class="train-status ${train.status}">${train.status.replace('_', ' ')}</div>
                </div>
                <div class="train-metrics">
                    <div class="train-metric">
                        <div class="train-metric-value">${train.health}%</div>
                        <div class="train-metric-label">Health</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.speed}</div>
                        <div class="train-metric-label">Speed (km/h)</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${(train.mileage / 1000).toFixed(0)}k</div>
                        <div class="train-metric-label">Mileage (km)</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.branding?.advertiser ? 'Yes' : 'No'}</div>
                        <div class="train-metric-label">Branded</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterFleet(status) {
        this.renderFleetGrid(status);
    }

    refreshFleetData() {
        // Simulate data refresh
        this.renderFleetGrid();
    }

    showTrainModal(trainId) {
        const train = this.data.trains.find(t => t.id === trainId) || {
            id: trainId,
            status: 'in_service',
            health: 90,
            doors: 92,
            braking: 88,
            hvac: 94,
            mileage: 125000,
            branding: { advertiser: null, hours_remaining: 0 }
        };

        const modal = document.getElementById('trainDetailsModal');
        const title = document.getElementById('trainModalTitle');
        const body = document.getElementById('trainModalBody');

        if (!modal || !title || !body) return;

        title.textContent = `${train.id} - Detailed View`;
        body.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <h4>System Health</h4>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.health}%</div>
                        <div class="train-metric-label">Overall Health</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.doors || 90}%</div>
                        <div class="train-metric-label">Door System</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.braking || 85}%</div>
                        <div class="train-metric-label">Braking System</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.hvac || 92}%</div>
                        <div class="train-metric-label">HVAC System</div>
                    </div>
                </div>
                <div>
                    <h4>Operational Data</h4>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.status.replace('_', ' ')}</div>
                        <div class="train-metric-label">Current Status</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${(train.mileage / 1000).toFixed(0)}k km</div>
                        <div class="train-metric-label">Total Mileage</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.branding?.advertiser || 'None'}</div>
                        <div class="train-metric-label">Current Branding</div>
                    </div>
                    <div class="train-metric">
                        <div class="train-metric-value">${train.branding?.hours_remaining || 0}h</div>
                        <div class="train-metric-label">Branding Remaining</div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    initializeDepot() {
        this.createDepotCapacityChart();
        this.renderBayLayout();
        this.renderStaffInfo();
        this.renderOperationsList();
    }

    createDepotCapacityChart() {
        const ctx = document.getElementById('depotCapacityChart');
        if (!ctx) return;

        if (this.charts.depotCapacity) {
            this.charts.depotCapacity.destroy();
        }

        this.charts.depotCapacity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Available'],
                datasets: [{
                    data: [this.data.depot.current_occupancy, this.data.depot.total_capacity - this.data.depot.current_occupancy],
                    backgroundColor: ['#FFC185', '#1FB8CD'],
                    borderWidth: 2,
                    borderColor: '#1a1f2e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    renderBayLayout() {
        const bayLayout = document.getElementById('bayLayout');
        if (!bayLayout) return;

        let bayHTML = '';
        for (let i = 1; i <= this.data.depot.total_capacity; i++) {
            const isOccupied = i <= this.data.depot.current_occupancy;
            const isMaintenance = i <= this.data.depot.maintenance_bays;
            bayHTML += `
                <div class="bay ${isOccupied ? (isMaintenance ? 'maintenance' : 'occupied') : ''}">
                    Bay ${i}${isOccupied ? `<br>KMRL-${i.toString().padStart(3, '0')}` : '<br>Empty'}
                </div>
            `;
        }
        bayLayout.innerHTML = bayHTML;
    }

    renderStaffInfo() {
        const staffInfo = document.getElementById('staffInfo');
        if (!staffInfo) return;

        staffInfo.innerHTML = `
            <div class="train-metric">
                <div class="train-metric-value">${this.data.depot.staff_current}</div>
                <div class="train-metric-label">Current Staff</div>
            </div>
            <div class="train-metric">
                <div class="train-metric-value">${this.data.depot.staff_total}</div>
                <div class="train-metric-label">Total Capacity</div>
            </div>
            <div class="train-metric">
                <div class="train-metric-value">${Math.round((this.data.depot.staff_current / this.data.depot.staff_total) * 100)}%</div>
                <div class="train-metric-label">Utilization</div>
            </div>
        `;
    }

    renderOperationsList() {
        const operationsList = document.getElementById('operationsList');
        if (!operationsList) return;

        const operations = [
            { activity: 'Daily Cleaning', status: 'In Progress', time: '06:00-08:00' },
            { activity: 'Routine Inspection', status: 'Scheduled', time: '14:00-16:00' },
            { activity: 'Battery Maintenance', status: 'Completed', time: '10:00-12:00' },
            { activity: 'HVAC Service', status: 'Pending', time: '18:00-20:00' }
        ];

        operationsList.innerHTML = operations.map(op => `
            <div class="operation-item">
                <div>
                    <div style="font-weight: 500;">${op.activity}</div>
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${op.time}</div>
                </div>
                <div class="status status--${op.status.toLowerCase().replace(' ', '-')}">${op.status}</div>
            </div>
        `).join('');
    }

    initializeMaintenance() {
        this.renderMaintenanceSchedule();
        this.renderPriorityQueue();
        this.renderCrewAssignments();
        this.createHealthTrendsChart();
    }

    renderMaintenanceSchedule() {
        const schedule = document.getElementById('maintenanceSchedule');
        if (!schedule) return;

        const maintenanceItems = [
            { train: 'KMRL-002', type: 'Major Service', date: '2025-10-02', priority: 'High' },
            { train: 'KMRL-007', type: 'Brake Inspection', date: '2025-10-03', priority: 'Medium' },
            { train: 'KMRL-015', type: 'HVAC Service', date: '2025-10-04', priority: 'Low' },
            { train: 'KMRL-021', type: 'Door System Check', date: '2025-10-05', priority: 'Medium' }
        ];

        schedule.innerHTML = maintenanceItems.map(item => `
            <div class="maintenance-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 500;">${item.train}</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${item.type}</div>
                    </div>
                    <div>
                        <div class="status status--${item.priority.toLowerCase()}">${item.priority}</div>
                        <div style="font-size: 0.8rem; margin-top: 4px;">${item.date}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPriorityQueue() {
        const queue = document.getElementById('priorityQueue');
        if (!queue) return;

        const priorityItems = [
            { train: 'KMRL-002', issue: 'HVAC malfunction', priority: 'Critical', eta: '2 hours' },
            { train: 'KMRL-018', issue: 'Door sensor fault', priority: 'High', eta: '4 hours' },
            { train: 'KMRL-009', issue: 'Routine service', priority: 'Medium', eta: '8 hours' }
        ];

        queue.innerHTML = priorityItems.map(item => `
            <div class="priority-item">
                <div>
                    <div style="font-weight: 500;">${item.train}</div>
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${item.issue}</div>
                    <div style="font-size: 0.8rem; margin-top: 4px;">ETA: ${item.eta}</div>
                </div>
                <div class="status status--${item.priority.toLowerCase()}">${item.priority}</div>
            </div>
        `).join('');
    }

    renderCrewAssignments() {
        const assignments = document.getElementById('crewAssignments');
        if (!assignments) return;

        const crews = [
            { name: 'Team Alpha', lead: 'Rajesh Kumar', task: 'KMRL-002 Service', shift: 'Morning' },
            { name: 'Team Beta', lead: 'Priya Nair', task: 'Routine Inspections', shift: 'Afternoon' },
            { name: 'Team Gamma', lead: 'Suresh Menon', task: 'Emergency Support', shift: 'Night' }
        ];

        assignments.innerHTML = crews.map(crew => `
            <div class="crew-item">
                <div style="font-weight: 500;">${crew.name}</div>
                <div style="font-size: 0.8rem; color: var(--color-text-secondary);">Lead: ${crew.lead}</div>
                <div style="font-size: 0.8rem; margin-top: 4px;">${crew.task}</div>
                <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${crew.shift} Shift</div>
            </div>
        `).join('');
    }

    createHealthTrendsChart() {
        const ctx = document.getElementById('healthTrendsChart');
        if (!ctx) return;

        if (this.charts.healthTrends) {
            this.charts.healthTrends.destroy();
        }

        this.charts.healthTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Fleet Health Average',
                    data: [92, 91, 93, 90, 92, 94],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f5f5'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    initializeSimulation() {
        this.updateScenarioOptions('train_failure');
    }

    updateScenarioOptions(scenarioType) {
        const affectedAsset = document.getElementById('affectedAsset');
        if (!affectedAsset) return;

        let options = [];
        
        switch(scenarioType) {
            case 'train_failure':
                options = this.data.trains.map(train => ({ value: train.id, text: train.id }));
                break;
            case 'station_closure':
                options = this.data.stations.map(station => ({ value: station.code, text: `${station.name} (${station.code})` }));
                break;
            case 'maintenance_delay':
                options = [
                    { value: 'depot', text: 'Muttom Depot' },
                    { value: 'maintenance_bay', text: 'Maintenance Bay' }
                ];
                break;
            case 'weather_impact':
                options = [
                    { value: 'heavy_rain', text: 'Heavy Rain' },
                    { value: 'strong_wind', text: 'Strong Wind' },
                    { value: 'fog', text: 'Dense Fog' }
                ];
                break;
        }

        affectedAsset.innerHTML = options.map(option => 
            `<option value="${option.value}">${option.text}</option>`
        ).join('');
    }

    runSimulation() {
        if (this.simulationRunning) return;

        this.simulationRunning = true;
        const resultsContent = document.getElementById('resultsContent');
        const runButton = document.getElementById('runSimulation');
        
        if (runButton) runButton.textContent = 'Running...';
        if (resultsContent) resultsContent.innerHTML = '<div class="loading">Running simulation...</div>';

        setTimeout(() => {
            this.displaySimulationResults();
            if (runButton) runButton.textContent = 'Run Simulation';
            this.simulationRunning = false;
        }, 3000);
    }

    displaySimulationResults() {
        const resultsContent = document.getElementById('resultsContent');
        if (!resultsContent) return;

        const scenarioType = document.getElementById('scenarioType')?.value;
        const affectedAsset = document.getElementById('affectedAsset')?.value;
        const duration = document.getElementById('scenarioDuration')?.value;

        const results = {
            affected_services: Math.floor(Math.random() * 8) + 2,
            passenger_impact: Math.floor(Math.random() * 5000) + 1000,
            revenue_loss: Math.floor(Math.random() * 50000) + 10000,
            recovery_time: Math.floor(Math.random() * 60) + 30,
            alternative_routes: Math.floor(Math.random() * 3) + 1
        };

        resultsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                <div class="train-metric">
                    <div class="train-metric-value">${results.affected_services}</div>
                    <div class="train-metric-label">Affected Services</div>
                </div>
                <div class="train-metric">
                    <div class="train-metric-value">${results.passenger_impact.toLocaleString()}</div>
                    <div class="train-metric-label">Passenger Impact</div>
                </div>
                <div class="train-metric">
                    <div class="train-metric-value">₹${results.revenue_loss.toLocaleString()}</div>
                    <div class="train-metric-label">Revenue Loss</div>
                </div>
                <div class="train-metric">
                    <div class="train-metric-value">${results.recovery_time} min</div>
                    <div class="train-metric-label">Recovery Time</div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h4>Recommended Actions:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Deploy backup train from depot</li>
                    <li>Implement ${results.alternative_routes} alternative route(s)</li>
                    <li>Increase service frequency on adjacent lines</li>
                    <li>Activate passenger information system</li>
                </ul>
            </div>
        `;
    }

    resetSimulation() {
        const resultsContent = document.getElementById('resultsContent');
        if (resultsContent) {
            resultsContent.innerHTML = '<p>Configure and run a simulation to see impact analysis.</p>';
        }
        document.getElementById('scenarioDuration').value = '30';
    }

    initializeAnalytics() {
        this.createPassengerFlowChart();
        this.createServiceFrequencyChart();
        this.createPunctualityChart();
        this.renderKPIs();
    }

    createPassengerFlowChart() {
        const ctx = document.getElementById('passengerFlowChart');
        if (!ctx) return;

        if (this.charts.passengerFlow) {
            this.charts.passengerFlow.destroy();
        }

        this.charts.passengerFlow = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: 'Passenger Count',
                    data: [1200, 4500, 2800, 3200, 2100, 3800, 5200, 2900],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f5f5'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    createServiceFrequencyChart() {
        const ctx = document.getElementById('serviceFrequencyChart');
        if (!ctx) return;

        if (this.charts.serviceFrequency) {
            this.charts.serviceFrequency.destroy();
        }

        this.charts.serviceFrequency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Peak Hours', 'Off-Peak', 'Late Night'],
                datasets: [{
                    label: 'Frequency (trains/hour)',
                    data: [12, 8, 4],
                    backgroundColor: ['#FFC185', '#1FB8CD', '#B4413C'],
                    borderWidth: 1,
                    borderColor: '#1a1f2e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f5f5'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    createPunctualityChart() {
        const ctx = document.getElementById('punctualityChart');
        if (!ctx) return;

        if (this.charts.punctuality) {
            this.charts.punctuality.destroy();
        }

        this.charts.punctuality = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Punctuality %',
                    data: [98.5, 97.8, 98.9, 98.2, 97.5, 99.1, 98.8],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f5f5'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        min: 95,
                        max: 100,
                        ticks: { color: '#f5f5f5' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    renderKPIs() {
        const kpiList = document.getElementById('kpiList');
        if (!kpiList) return;

        const kpis = [
            { label: 'Daily Revenue', value: `₹${this.data.operations.revenue?.toLocaleString() || '145,000'}` },
            { label: 'Energy Consumption', value: `${this.data.operations.energy_consumption || 2400} kWh` },
            { label: 'Average Speed', value: '45 km/h' },
            { label: 'Fleet Availability', value: '92%' },
            { label: 'Customer Satisfaction', value: '4.6/5' },
            { label: 'Environmental Impact', value: '-15% CO2' }
        ];

        kpiList.innerHTML = kpis.map(kpi => `
            <div class="kpi-item">
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-value">${kpi.value}</div>
            </div>
        `).join('');
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRealTimeData();
        }, 5000);
    }

    updateRealTimeData() {
        // Simulate small changes in operational data
        this.data.operations.passenger_load += Math.floor(Math.random() * 200 - 100);
        this.data.operations.punctuality += (Math.random() - 0.5) * 0.2;
        
        // Keep values within realistic bounds
        this.data.operations.passenger_load = Math.max(15000, Math.min(30000, this.data.operations.passenger_load));
        this.data.operations.punctuality = Math.max(95, Math.min(100, this.data.operations.punctuality));

        // Update train positions
        this.data.trains.forEach(train => {
            if (train.status === 'in_service' && Math.random() > 0.7) {
                train.current_station = Math.min(this.data.stations.length - 1, train.current_station + 1);
            }
        });

        // Update dashboard if visible
        if (this.currentView === 'dashboard') {
            this.updateMetrics();
        }

        // Update route map if visible
        if (this.currentView === 'route-map') {
            this.initializeRouteMap();
        }
    }

    showTrainDetails(train) {
        this.showTrainModal(train.id);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.kmrlApp = new KMRLDigitalTwin();
    kmrlApp.init();
});

// Handle modal backdrop clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.kmrlApp && window.kmrlApp.charts) {
        Object.values(window.kmrlApp.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
});