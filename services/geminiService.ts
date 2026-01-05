
import { GoogleGenAI } from "@google/genai";
import { CompanyStats, Employee } from "../types";

export class GeminiSupportService {
  async getSupportResponse(
    userMessage: string, 
    stats: CompanyStats,
    username: string,
    employees: Employee[]
  ): Promise<string> {
    try {
      // Initialize the API client right before the call to ensure the latest API_KEY is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Constructing the Advanced context as requested
      const employeeContext = employees.slice(0, 50).map(e => ({
        name: e.fullName,
        role: e.position,
        salary: `₹${e.monthlyIncome.toLocaleString('en-IN')}`,
        status: e.status
      }));

      const systemInstruction = `
        You are the Salario Intelligent Assistant, a premium payroll and financial expert for this organization.
        Your goal is to help the Admin manage their organization's dashboard with precision and insights.

        --- CURRENT LIVE DATA CONTEXT ---
        Logged in User: ${username} (Administrator)
        Current Date: ${new Date().toDateString()}

        Financial Snapshot:
        - Total Monthly Payroll: ₹${stats.totalExpenditure.toLocaleString('en-IN')}
        - Company Budget: ₹${stats.totalBudget.toLocaleString('en-IN')}
        - Current Savings: ₹${stats.remainingBudget.toLocaleString('en-IN')}
        - Status: ${stats.remainingBudget >= 0 ? 'Under Budget' : 'OVER BUDGET'}
        - Workforce Size: ${stats.employeeCount} individuals

        Employee Database Snapshot:
        ${JSON.stringify(employeeContext, null, 2)}
        ---------------------------------

        INSTRUCTIONS & BEHAVIOR:
        1. **Greetings:** Always be polite. Greet the user by their name (${username}) if they say hi.
        2. **Data Queries:** If asked about specific employee earnings (e.g. "How much does Siddharth earn?"), look at the Employee Database Snapshot above and answer accurately.
        3. **Analytics:** If asked about the budget or company health, analyze the Financial Snapshot. If savings are negative, proactively warn the user and suggest caution.
        4. **Action Triggers:** If the user wants to "add an employee" or "onboard someone", explicitly mention that you are opening the recruitment module for them.
        5. **Tone:** Maintain a professional, executive-level, and concise tone. Do not hallucinate data that isn't in the snapshot.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });

      return response.text || "I was unable to process the current financial stream. Please try rephrasing.";
    } catch (error) {
      console.error("SalarioAI Brain Error:", error);
      return "Critical link failure with the Salario Intelligence Node. Please ensure your session is secure and try again.";
    }
  }
}
