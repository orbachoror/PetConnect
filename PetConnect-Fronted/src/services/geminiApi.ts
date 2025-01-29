import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = import.meta.env.VITE_API_GOOGLE_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateTitleWithImage = async (file: File): Promise<string> => {

    const fileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const base64Image = await fileToBase64(file);

    const mimeType = file.type;

    const imagePart = {
        inlineData: {
            data: base64Image.split(",")[1],
            mimeType,
        },
    };

    const prompt = "Provide one title and just the title with maximum of 10 words for post with the image im providing ";
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text(); // Return the generated title
};

export const postReleatedToPets = async (descrption: string) => {
    const prompt = "Return only one word: true if the description im sending you is related to pets or false if not, dont include any other word beside true or false.";
    const result = await model.generateContent([prompt, descrption]);
    return (result.response.text().trim() === "true") ? true : false;
}
