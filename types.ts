export interface TrafficMetrics {
  avgWaitTimeBefore: number;
  avgWaitTimeAfter: number;
  trafficFlowRate: number;
  co2Reduction: number;
}

export interface CongestionHotspot {
  location: string;
  congestionLevel: 'High' | 'Medium' | 'Low';
}

export interface AISummary {
  title: string;
  positiveHighlight: string;
  challengeHighlight: string;
  outlook: string;
}

export interface LiveFeedItem {
  time: string; // e.g., "2m ago"
  event: string;
}

export interface TrafficReport {
  summary: AISummary;
  metrics: TrafficMetrics;
  hotspots: CongestionHotspot[];
  systemStatus: 'Operational' | 'Monitoring' | 'High-Alert';
  liveFeed: LiveFeedItem[];
}

export interface ForecastHotspot {
    location: string;
    predictedCongestion: 'High' | 'Medium' | 'Low';
    reason: string;
}

export interface TrafficForecast {
  forecastTime: string;
  overallTrend: string;
  summary: string;
  hotspots: ForecastHotspot[];
  dataSources: string[];
}

export interface Waypoint {
  instruction: string;
  distanceKm: number;
}

export interface RouteSuggestion {
  summary: string;
  optimalRoute: string;
  timeSaved: string;
  estimatedTravelTime: string;
  waypoints: Waypoint[];
  totalDistanceKm: number;
  googleMapsUrl: string;
}

export interface EmergencyScenario {
    vehicleType: 'Ambulance' | 'Fire Truck' | 'Police Cruiser';
    location: string;
    destination: string;
}