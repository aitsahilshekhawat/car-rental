import { GoogleGenAI } from "@google/genai";
import Car from "../models/car.model.js";

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      return res.status(500).json({ message: "Gemini API key not configured in .env file" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Fetch all available cars from database for context
    const cars = await Car.find({ available: true }).lean();

    const carInventory = cars
      .map(
        (car) =>
          `- ${car.name} | Brand: ${car.brand} | ₹${car.pricePerDay}/day | Fuel: ${car.fuelType} | Transmission: ${car.transmission} | Seats: ${car.seatingCapacity} | Location: ${car.location} | Rating: ${car.averageRating || "N/A"}/5`
      )
      .join("\n");

    const systemPrompt = `You are "RideBot", a friendly and knowledgeable AI assistant for CarRental — India's premium luxury car rental platform.

YOUR PERSONALITY:
- Warm, professional, and helpful. Use a mix of English (keep it simple).
- Keep responses concise (2-4 sentences max unless the user asks for details).
- Use relevant emojis sparingly to make responses engaging (🚗, ✨, 💰, etc.)

YOUR KNOWLEDGE - CURRENT CAR INVENTORY:
${carInventory || "No cars currently available in inventory."}

RULES:
1. ONLY recommend cars from the inventory above. Never make up cars that don't exist.
2. If a user asks for something not in the inventory, politely say it's not available and suggest the closest alternative.
3. You can answer general questions about car rentals, policies, driving tips, and travel recommendations.
4. For booking, payment, or account issues, suggest the user visit "My Bookings" or "Help Center" pages.
5. If someone asks something completely unrelated to cars/travel, gently redirect them.
6. Never reveal that you are reading from a database or inventory list. Act naturally as if you know this information.
7. When recommending a car, mention its key specs (price, seats, fuel, location).

GENERAL POLICIES (use when relevant):
- All cars come with comprehensive insurance and 24/7 roadside assistance.
- Free cancellation up to 24 hours before pickup.
- Cars are thoroughly sanitized before every handover.
- Minimum age to rent: 21 years with a valid driving license.
- Security deposit is fully refundable after car return.`;

    // Build conversation history for multi-turn chat
    const contents = [];

    // Add previous conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Try primary model, fallback to lite on rate limit
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
    let response = null;
    let lastError = null;

    for (const model of models) {
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        });
        break; // success, stop trying
      } catch (err) {
        lastError = err;
        console.log(`Model ${model} failed:`, err.status || err.message);
        if (err.status === 429) {
          continue; // try next model
        }
        throw err; // non-rate-limit error, don't retry
      }
    }

    if (!response) {
      // Both models rate-limited
      return res.status(429).json({
        message: "RideBot is getting too many requests right now! ⏳ Please wait 1-2 minutes and try again.",
      });
    }

    const reply = response.text || "Sorry, I couldn't process that. Please try again!";

    res.status(200).json({ reply });
  } catch (error) {
    console.log("CHAT ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "RideBot is getting too many requests right now! ⏳ Please wait 1-2 minutes and try again.",
      });
    }

    if (error.message?.includes("API_KEY")) {
      return res.status(500).json({ message: "Invalid Gemini API key. Please check your configuration." });
    }

    res.status(500).json({ message: "AI assistant is temporarily unavailable. Please try again later." });
  }
};
