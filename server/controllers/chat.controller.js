import { GoogleGenAI } from "@google/genai";
import prisma from "../config/prisma.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Get available cars from DB
    const cars = await prisma.car.findMany({
      where: { available: true },
    });

    const carList = cars
      .map(
        (car) =>
          `${car.name} - ${car.brand} | ₹${car.pricePerDay}/day | ${car.fuelType} | ${car.transmission} | ${car.seatingCapacity} seats | ${car.location}`,
      )
      .join("\n");

    const systemPrompt = `You are DriveOn AI Assistant, a helpful car rental chatbot.
Available Cars:
${carList}

Help users find the perfect car. Be concise and friendly. If asked about specific cars, reference the list above.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.status(200).json({
      message: response.text,
    });
  } catch (error) {
    console.log("CHAT ERROR:", error);
    res.status(500).json({ message: "AI Chat Error" });
  }
};
