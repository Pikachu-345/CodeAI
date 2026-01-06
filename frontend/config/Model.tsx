import { Messages } from '@/types/MessagesContextType';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, 
});

export default async function sendResp(messages: Messages){
    const chatCompletion = await client.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.3-70b-versatile',
    });
    // console.log(chatCompletion.choices);
    return chatCompletion.choices[0].message;
}
