import sendResp from "@/config/Model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const { messages } =await request.json();

    const aiResponse = await sendResp(messages);
    console.log(aiResponse);

    return NextResponse.json({ result: aiResponse });
}