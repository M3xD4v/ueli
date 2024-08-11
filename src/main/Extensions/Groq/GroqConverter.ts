import https from 'https';

async function getChatCompletion(prompt, apiKey, model) {
    console.log(prompt,apiKey,model)
    const data = JSON.stringify({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: model
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
    public static async encode(payload: string, apiKey: string, model: string): string {
        const response = await getChatCompletion(payload, apiKey, model);
        return response.choices[0].message.content;
    }

    public static decode(payload: string, apiKey: string): string {
        return "buh"
    }
}
