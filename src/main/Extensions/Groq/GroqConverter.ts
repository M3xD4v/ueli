import https from 'https';
const apiKey = "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";
async function getChatCompletion(prompt) {
    const data = JSON.stringify({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama3-8b-8192"
    });

    const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(responseBody);
                    resolve(jsonResponse);
                } catch (error) {
                    reject('Error parsing response: ' + error);
                }
            });
        });

        req.on('error', (error) => {
            reject('Request error: ' + error);
        });

        // Write data to request body
        req.write(data);
        req.end();
    });
}

export class GroqConverter {
    public static async encode(payload: string): string {
        const response = await getChatCompletion(payload);
        return response.choices[0].message.content;
    }

    public static decode(payload: string): string {
        return "buh"
    }
}
