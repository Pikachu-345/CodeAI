import sendResp from "@/config/Model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const streamResponse = await sendResp(messages);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamResponse) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}