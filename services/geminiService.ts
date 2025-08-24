
import { GoogleGenAI, Type } from "@google/genai";
import type { TrafficReport, TrafficForecast, RouteSuggestion, EmergencyScenario, LogisticsReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const aiSummarySchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy, dynamic headline for the current traffic situation (e.g., 'Morning Rush Easing')." },
        positiveHighlight: { type: Type.STRING, description: "A sentence highlighting a key success or positive metric (e.g., 'Wait times reduced by 35% on Outer Ring Road.')." },
        challengeHighlight: { type: Type.STRING, description: "A sentence describing a current challenge the system is managing (e.g., 'Actively managing high-volume traffic near Majestic due to a bus breakdown.')." },
        outlook: { type: Type.STRING, description: "A brief, forward-looking statement (e.g., 'Expecting moderate traffic flow for the next hour.')." }
    },
    required: ["title", "positiveHighlight", "challengeHighlight", "outlook"]
};

const liveFeedSchema = {
    type: Type.ARRAY,
    description: "A list of 3-4 recent, simulated real-time events handled by the AI.",
    items: {
        type: Type.OBJECT,
        properties: {
            time: { type: Type.STRING, description: "A relative timestamp for the event (e.g., 'Just now', '2m ago')." },
            event: { type: Type.STRING, description: "A short description of the event (e.g., 'Signal timings adjusted on Hosur Road.')." }
        },
        required: ["time", "event"]
    }
};

const trafficReportSchema = {
  type: Type.OBJECT,
  properties: {
    summary: aiSummarySchema,
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
    },
    systemStatus: {
        type: Type.STRING,
        enum: ['Operational', 'Monitoring', 'High-Alert'],
        description: "The overall status of the GreenWave AI network. 'Operational' is normal. 'Monitoring' for unusual patterns. 'High-Alert' for major incidents."
    },
    liveFeed: liveFeedSchema
  },
  required: ["summary", "metrics", "hotspots", "systemStatus", "liveFeed"]
};

const trafficForecastSchema = {
    type: Type.OBJECT,
    properties: {
        forecastTime: {
            type: Type.STRING,
            description: "A confirmation of the time the forecast is for (e.g., 'Tomorrow at 5 PM')."
        },
        overallTrend: {
            type: Type.STRING,
            description: "A short, high-level summary of the expected city-wide traffic trend (e.g., 'Heavier than usual evening traffic')."
        },
        summary: {
            type: Type.STRING,
            description: "A 2-sentence summary explaining the forecast, highlighting the system's predictive capabilities."
        },
        hotspots: {
            type: Type.ARRAY,
            description: "A list of 3-5 specific predicted congestion hotspots.",
            items: {
                type: Type.OBJECT,
                properties: {
                    location: {
                        type: Type.STRING,
                        description: "The specific street, lane, or intersection name (e.g., 'Marathahalli Bridge, Eastbound Lane')."
                    },
                    predictedCongestion: {
                        type: Type.STRING,
                        enum: ["High", "Medium", "Low"],
                        description: "The predicted level of congestion for that specific location."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief, clear reason for the predicted congestion derived from data sources (e.g., 'High volume due to cricket match at Chinnaswamy Stadium')."
                    }
                },
                required: ["location", "predictedCongestion", "reason"]
            }
        },
        dataSources: {
            type: Type.ARRAY,
            description: "A list of 2-3 key data sources that were most influential for this forecast (e.g., 'Real-time signal data', 'City event calendar', 'Weather predictions').",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["forecastTime", "overallTrend", "summary", "hotspots", "dataSources"]
};

const routeSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A 2-sentence summary of the suggested route and why it's optimal."
    },
    optimalRoute: {
      type: Type.STRING,
      description: "The name of the main road or corridor for the suggested route (e.g., 'Via Outer Ring Road')."
    },
    timeSaved: {
      type: Type.STRING,
      description: "Estimated time saved compared to a standard route (e.g., '15-20 minutes')."
    },
    estimatedTravelTime: {
        type: Type.STRING,
        description: "The total estimated travel time for this optimized route in a friendly format (e.g., '25-30 minutes')."
    },
    waypoints: {
      type: Type.ARRAY,
      description: "A list of clear, turn-by-turn directions. Each waypoint must include a concise instruction and the distance in kilometers to the next point. For the final destination, the distance can be 0.",
      items: {
        type: Type.OBJECT,
        properties: {
          instruction: {
            type: Type.STRING,
            description: "The turn-by-turn instruction for this waypoint (e.g., 'Turn left onto Hosur Road')."
          },
          distanceKm: {
            type: Type.NUMBER,
            description: "The distance in kilometers from this waypoint to the next. For the final destination, this can be 0."
          }
        },
        required: ["instruction", "distanceKm"]
      }
    },
    totalDistanceKm: {
        type: Type.NUMBER,
        description: "The total distance of the entire optimized route in kilometers, rounded to one decimal place."
    },
    googleMapsUrl: {
      type: Type.STRING,
      description: "A fully-formed, URL-encoded Google Maps embed URL that works without an API key. The URL must show directions from the start to the end location, including the waypoints. The format must be `https://www.google.com/maps?q=directions+from+...&output=embed`. The query parameter `q` should contain the start, end, and all waypoints to construct the route. Do NOT include any API key in the URL."
    }
  },
  required: ["summary", "optimalRoute", "timeSaved", "estimatedTravelTime", "waypoints", "totalDistanceKm", "googleMapsUrl"]
};

const emergencyScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        vehicleType: {
            type: Type.STRING,
            enum: ['Ambulance', 'Fire Truck', 'Police Cruiser'],
            description: "The type of emergency vehicle."
        },
        location: {
            type: Type.STRING,
            description: "The current location or starting point of the emergency vehicle in Bangalore (e.g., 'near Jayanagar')."
        },
        destination: {
            type: Type.STRING,
            description: "The destination of the emergency vehicle (e.g., 'heading towards Manipal Hospital')."
        }
    },
    required: ["vehicleType", "location", "destination"]
};

const logisticsReportSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A dynamic headline for the logistics operation (e.g., 'Prioritizing Evening Deliveries in Koramangala')." },
                description: { type: Type.STRING, description: "A 1-2 sentence summary of the action being taken by the AI." }
            },
            required: ["title", "description"]
        },
        metrics: {
            type: Type.OBJECT,
            properties: {
                deliveryTimeImprovement: { type: Type.INTEGER, description: "Estimated delivery time improvement as a percentage. A value between 10 and 25." },
                impactOnGeneralTraffic: { type: Type.INTEGER, description: "The minimal, acceptable impact on general traffic delay as a percentage. A value between 1 and 5." },
                prioritizedCorridor: { type: Type.STRING, description: "The name of the main road or corridor being prioritized (e.g., '100 Feet Road, Indiranagar')." }
            },
            required: ["deliveryTimeImprovement", "impactOnGeneralTraffic", "prioritizedCorridor"]
        },
        activeFleets: {
            type: Type.ARRAY,
            description: "A list of 2-3 fictional, representative quick commerce (q-commerce) fleets being prioritized. These are primarily two-wheeler fleets.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the delivery service (e.g., 'SwiftBites', 'ZeptoDash', 'InstaCart Go')." },
                    vehicleCount: { type: Type.INTEGER, description: "The number of simulated active two-wheeler riders in the area for this fleet. A value between 15 and 40." }
                },
                required: ["name", "vehicleCount"]
            }
        },
        routeSuggestion: {
            ...routeSuggestionSchema,
            description: "An optional, optimized shortcut route for a delivery pilot, generated by analyzing real-time camera and sensor data to bypass micro-congestion."
        }
    },
    required: ["summary", "metrics", "activeFleets"]
};


export const generateTrafficReport = async (): Promise<TrafficReport> => {
  try {
    const prompt = `
      Act as the GreenWave AI traffic analysis engine for Bangalore.
      Generate a realistic, simulated, and comprehensive traffic report.
      The data should reflect a positive impact from the AI system but also acknowledge real-world challenges.
      
      Provide the following:
      1. A structured AI Summary: Include a dynamic title, a key positive highlight, a current challenge the system is managing, and a brief outlook.
      2. Key Performance Metrics: Average wait times before and after, traffic flow rate, and CO2 reduction.
      3. A list of 3-5 current Congestion Hotspots.
      4. The overall System Status: ('Operational', 'Monitoring', or 'High-Alert').
      5. A Live Traffic Feed: A list of 3-4 recent, distinct events handled by the AI with relative timestamps.
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
    
    if (!data.summary || !data.metrics || !data.hotspots || !data.systemStatus || !data.liveFeed) {
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
      Act as the GreenWave AI's advanced traffic prediction engine for Bangalore. The system has access to a comprehensive, city-wide data lake, including:
      - Live data from every traffic signal and intersection sensor.
      - Anonymized vehicle GPS data.
      - Public transport schedules and delays.
      - City event calendars (concerts, sports, etc.).
      - Weather forecasts.
      - Historical traffic patterns.

      A user wants a detailed traffic forecast for: "${timeQuery}".

      Synthesize the available data to generate a forecast.
      Identify 3-5 specific streets, lanes, or intersections expected to become congestion hotspots.
      For each hotspot, provide its location, predicted congestion, and a clear reason derived from the data sources (e.g., 'High volume due to cricket match at Chinnaswamy Stadium').
      Also, list 2-3 of the most influential data sources you used for this specific forecast.
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
    
    if (!data.forecastTime || !data.overallTrend || !data.summary || !data.hotspots || !data.dataSources) {
        throw new Error("Invalid data structure received from API");
    }

    return data as TrafficForecast;

  } catch (error) {
    console.error("Error generating traffic forecast:", error);
    throw new Error("Failed to generate forecast from the AI. Please try again.");
  }
};

export const generateRouteSuggestion = async (start: string, end: string): Promise<RouteSuggestion> => {
  if (!start.trim() || !end.trim()) {
    throw new Error("Please provide both a start and end location.");
  }

  try {
    const prompt = `
      Act as the GreenWave AI route optimization engine for Bangalore.
      A user wants the most efficient, turn-by-turn route from "${start}" to "${end}".
      Leverage your knowledge of real-time traffic data (simulated) to avoid congestion hotspots and create a "green wave" route.
      Provide a concise summary, the main suggested route corridor, estimated time saved compared to a standard route during peak hour, the total estimated travel time for this route (e.g., '25-30 minutes'), the total route distance in kilometers (rounded to one decimal place), and a list of clear, simple turn-by-turn waypoints. Each waypoint should have an instruction and the distance in kilometers to the next point.
      Finally, generate a fully-formed, URL-encoded Google Maps embed URL. The URL must construct a route from start to end, including all waypoints. It must be in the format 'https://www.google.com/maps?q=directions+from+...&output=embed' and should not require any API key.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: routeSuggestionSchema,
            temperature: 0.7,
        },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    if (!data.summary || !data.optimalRoute || !data.timeSaved || !data.waypoints || !data.googleMapsUrl) {
        throw new Error("Invalid data structure received from API");
    }

    return data as RouteSuggestion;

  } catch (error) {
    console.error("Error generating route suggestion:", error);
    throw new Error("Failed to generate route from the AI. Please try again.");
  }
};

export const generateEmergencyScenario = async (): Promise<EmergencyScenario> => {
    try {
        const prompt = `
            Act as the GreenWave AI emergency detection system for Bangalore.
            Generate a single, realistic emergency vehicle scenario.
            Specify the vehicle type, its current approximate location, and its destination.
            The scenario should be plausible for a major city.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: emergencyScenarioSchema,
                temperature: 0.9,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        if (!data.vehicleType || !data.location || !data.destination) {
            throw new Error("Invalid data structure received from API for emergency scenario.");
        }

        return data as EmergencyScenario;

    } catch (error) {
        console.error("Error generating emergency scenario:", error);
        throw new Error("Failed to generate an emergency scenario from the AI.");
    }
};

export const generateLogisticsReport = async (): Promise<LogisticsReport> => {
    try {
        const prompt = `
            Act as the GreenWave AI logistics optimization module for Bangalore, focusing on the hyper-competitive quick commerce (q-commerce) sector.
            Simulate a peak delivery rush (e.g., dinner time surge for food delivery, or evening grocery orders).
            The system's goal is to create a "soft priority" green corridor to aid two-wheeler delivery fleets. This must be done without significantly disrupting general traffic flow.

            CRITICAL: In some scenarios, where micro-congestion is detected via camera and sensor data, also generate an optimized "Smart Shortcut Route" for a delivery pilot. This route should use side streets or less-congested paths to bypass a specific bottleneck. When you generate a route, it should be realistic and helpful. Not all simulations should result in a shortcut.

            Generate a report that includes:
            1.  A summary with a title and a description of the AI's action.
            2.  Key metrics: delivery time improvement, impact on general traffic, and the prioritized corridor.
            3.  A list of 2-3 fictional q-commerce fleets being prioritized.
            4.  Optionally, a 'routeSuggestion' object containing the smart shortcut route, including waypoints and a Google Maps URL for a route from a plausible start (e.g. 'Koramangala 4th Block') to a plausible destination (e.g. 'Indiranagar 100ft Road').
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: logisticsReportSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        if (!data.summary || !data.metrics || !data.activeFleets) {
            throw new Error("Invalid data structure received from API for logistics report.");
        }

        return data as LogisticsReport;

    } catch (error) {
        console.error("Error generating logistics report:", error);
        throw new Error("Failed to generate a logistics report from the AI.");
    }
};
