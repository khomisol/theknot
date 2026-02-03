/**
 * Google Gemini AI Service
 * Provides AI-powered features for the scraping platform
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('[WARN] GEMINI_API_KEY not set. AI features will be disabled.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export class GeminiService {
  private model;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return !!this.model;
  }

  /**
   * Suggest locations based on partial input
   */
  async suggestLocations(partialInput: string): Promise<string[]> {
    if (!this.model) return [];

    try {
      const prompt = `Given the partial location input "${partialInput}", suggest 5 US cities in the format "city-state" (e.g., "seattle-wa", "los-angeles-ca"). 
      
      Return ONLY a JSON array of strings, no explanation:
      ["city1-state1", "city2-state2", ...]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const suggestions = JSON.parse(text.trim());
      return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
    } catch (error) {
      console.error('[ERROR] Gemini location suggestion failed:', error);
      return [];
    }
  }

  /**
   * Generate insights about scraped data
   */
  async generateDataInsights(data: any[]): Promise<string> {
    if (!this.model || data.length === 0) return '';

    try {
      // Sample data for analysis (max 10 items to avoid token limits)
      const sample = data.slice(0, 10);
      
      const prompt = `Analyze this wedding venue data and provide 3-4 brief insights:

${JSON.stringify(sample, null, 2)}

Focus on:
- Price ranges
- Rating patterns
- Location trends
- Notable venues

Keep it concise (2-3 sentences per insight).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[ERROR] Gemini insights generation failed:', error);
      return '';
    }
  }

  /**
   * Generate natural language query for data filtering
   */
  async parseNaturalQuery(query: string, availableFields: string[]): Promise<any> {
    if (!this.model) return null;

    try {
      const prompt = `Convert this natural language query into a filter object:
      
Query: "${query}"
Available fields: ${availableFields.join(', ')}

Return ONLY a JSON object with filter criteria:
{
  "field": "field_name",
  "operator": "equals|contains|greater_than|less_than",
  "value": "value"
}

If the query doesn't match any fields, return null.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (text === 'null') return null;
      return JSON.parse(text);
    } catch (error) {
      console.error('[ERROR] Gemini query parsing failed:', error);
      return null;
    }
  }

  /**
   * Generate smart description for a venue
   */
  async generateVenueDescription(venue: any): Promise<string> {
    if (!this.model) return '';

    try {
      const prompt = `Write a compelling 2-sentence description for this wedding venue:

Name: ${venue.name}
Location: ${venue.location}
Rating: ${venue.rating}/5 (${venue.reviews} reviews)
Price: ${venue.price}

Make it engaging and highlight key selling points.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('[ERROR] Gemini description generation failed:', error);
      return '';
    }
  }

  /**
   * Suggest optimal scraping parameters
   */
  async suggestScrapingParams(userGoal: string): Promise<any> {
    if (!this.model) return null;

    try {
      const prompt = `Based on this user goal: "${userGoal}"

Suggest optimal scraping parameters. Return ONLY a JSON object:
{
  "category": "wedding-reception-venues|wedding-ceremony-venues|wedding-photographers|wedding-florists",
  "maxPages": 1-10,
  "reasoning": "brief explanation"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      return JSON.parse(text);
    } catch (error) {
      console.error('[ERROR] Gemini param suggestion failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
