import { GoogleGenAI, Type } from "@google/genai";
import type { TrafficReport, TrafficForecast } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const trafficReportSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence summary of the traffic situation in Bangalore and the positive impact of the GreenWave AI system."
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        avgWaitTimeBefore: {
          type: Type.INTEGER,
          description: "Average intersection wait time in seconds BEFORE GreenWave AI. A value between 120 and 240."
        },
        avgWaitTimeAfter: {
          type: Type.INTEGER,
          description: "Average intersection wait time in seconds AFTER GreenWave AI. A value between 45 and 90."
        },
        trafficFlowRate: {
          type: Type.INTEGER,
          description: "Current city-wide traffic flow rate in vehicles per hour. A value between 8000 and 15000."
        },
        co2Reduction: {
          type: Type.INTEGER,
          description: "Estimated percentage of CO2 emission reduction. A value between 15 and 35."
        }
      },
      required: ["avgWaitTimeBefore", "avgWaitTimeAfter", "trafficFlowRate", "co2Reduction"]
    },
    hotspots: {
      type: Type.ARRAY,
      description: "A list of 3-5 major traffic congestion hotspots in Bangalore.",
      items: {
        type: Type.OBJECT,
        properties: {
          location: {
            type: Type.STRING,
            description: "Name of the intersection or area (e.g., 'Silk Board Junction')."
          },
          congestionLevel: {
            type: Type.STRING,
            enum: ["High", "Medium", "Low"],
            description: "The level of traffic congestion."
          }
        },
        required: ["location", "congestionLevel"]
      }
    }
  },
  required: ["summary", "metrics", "hotspots"]
};

const trafficForecastSchema = {
  type: Type.OBJECT,
  properties: {
    forecastTime: {
      type: Type.STRING,
      description: "A confirmation of the time the forecast is for (e.g., 'Tomorrow at 9 AM')."
    },
    expectedCongestion: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"],
      description: "The predicted overall congestion level for the city."
    },
    travelTimeImpact: {
        type: Type.STRING,
        description: "A short phrase describing the impact on travel times, e.g., 'Significant reduction', 'Slight improvement'."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-sentence summary explaining the forecast, mentioning why the AI system helps."
    }
  },
  required: ["forecastTime", "expectedCongestion", "travelTimeImpact", "summary"]
};


export const generateTrafficReport = async (): Promise<TrafficReport> => {
  try {
    const prompt = `
      Act as the GreenWave AI traffic analysis engine for Bangalore.
      Generate a realistic, simulated traffic report.
      The data should reflect a positive impact from the AI system.
      Provide a summary, key performance metrics, and a list of current congestion hotspots.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: trafficReportSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    if (!data.summary || !data.metrics || !data.hotspots) {
        throw new Error("Invalid data structure received from API");
    }

    return data as TrafficReport;

  } catch (error) {
    console.error("Error generating traffic report:", error);
    throw new Error("Failed to fetch traffic data from the AI. Please try again later.");
  }
};


export const generateTrafficForecast = async (timeQuery: string): Promise<TrafficForecast> => {
  if (!timeQuery.trim()) {
    throw new Error("Please provide a time for the forecast.");
  }

  try {
    const prompt = `
      Act as the GreenWave AI traffic analysis engine for Bangalore.
      Based on historical data and current trends, generate a realistic, simulated traffic forecast for: "${timeQuery}".
      The forecast must reflect the positive impact of the GreenWave AI system on efficiency.
      Provide the expected congestion level, the likely impact on travel times, and a brief summary.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: trafficForecastSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    if (!data.summary || !data.expectedCongestion || !data.forecastTime) {
      throw new Error("Invalid forecast data structure received from API");
    }

    return data as TrafficForecast;

  } catch (error) {
    console.error("Error generating traffic forecast:", error);
    throw new Error("Failed to generate a traffic forecast. The AI might be busy, please try again.");
  }
};
