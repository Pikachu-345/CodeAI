import { BASE_SandboxFiles } from '@/constants/BaseFile';
import { Messages } from '@/types/MessagesContextType';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, 
});

const SYSTEM_PROMPT = `
You are an expert full-stack developer.
When asked to generate code, strictly follow this XML format with text of what you have done:

<artifact id="project-import" title="Project Files">
  <action type="file" filePath="App.js">
    // content
  </action>
</artifact>

Everything outside these tags is conversational text.
Here is the basic structure of the already existing file.
${JSON.stringify(BASE_SandboxFiles)}

[IMPORTANT]: Don't try to include any backend just give frontend with relaistic dummy data only when required.  
[IMPORTANT]: You have access to tailwindcss, so consume it to design the app as a real UI desingner and code in that way.
[IMPORTANT]: Add comments only where required.
`;

export default async function sendResp(messages: Messages[]) {
  const allMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages
  ];

  const chatCompletion = await client.chat.completions.create({
    messages: allMessages as any,
    model: 'llama-3.3-70b-versatile',
    stream: true, 
  });

  return chatCompletion;
}