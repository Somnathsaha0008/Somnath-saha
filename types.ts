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

export interface TrafficReport {
  summary: string;
  metrics: TrafficMetrics;
  hotspots: CongestionHotspot[];
}

export interface TrafficForecast {
  forecastTime: string;
  expectedCongestion: 'High' | 'Medium' | 'Low';
  travelTimeImpact: string;
  summary: string;
}
