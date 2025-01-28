import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response } from 'express';
import logger from '../utils/logger';


export const geminiPostAndGetData = async (req: Request, res: Response) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        logger.error("API key not found");
        res.status(400).json({ error: "API key not found" });
        return;
    }
    const prompt = req.body.prompt;
    if (!prompt) {
        logger.error("Prompt is required");
        res.status(400).json({ error: "Prompt is required" });
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const result = await model.generateContent(prompt);
        const generatedContent = result.response.text();
        logger.info("Generated content: " + generatedContent);
        res.status(200).json({ generatedContent });
    } catch (error) {
        logger.error("Error in gemini generating content: " + error);
        res.status(500).json({ error: "Error in gemini generating content: " + error });
    }
}