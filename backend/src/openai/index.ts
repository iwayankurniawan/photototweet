import OpenAI from 'openai';
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.APIKEY, // defaults to process.env["OPENAI_API_KEY"]
});

export async function chatCompletion(text:string) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: text }],
        model: 'gpt-3.5-turbo',
    });
    console.log(chatCompletion.choices[0]?.message?.content)
    return chatCompletion.choices[0]?.message?.content;
}

export async function vision(base64_image: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens:20,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "What is in this image?" },
                    {
                        type: "image_url",
                        image_url: {
                            "url": `data:image/jpeg;base64,${base64_image}`,
                            "detail": "low"
                        },
                    },
                ],
            },
        ],
    });
    return response.choices[0]?.message?.content
}