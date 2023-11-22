import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
});

export async function chatCompletion() {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0]?.message?.content;
}

export async function vision(base64_image: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "What is in this image?" },
                    {
                        type: "image_url",
                        image_url: {
                            "url": `data:image/jpeg;base64,${base64_image}`,
                        },
                    },
                ],
            },
        ],
    });
    return response.choices[0]?.message?.content
}