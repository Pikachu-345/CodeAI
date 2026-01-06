"use client";

import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Messages } from "@/types/MessagesContextType";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";

export function ChatView() {
    const {workspaceId} = useParams();
    const convex = useConvex();
    const {messages,setMessages}=useContext(MessagesContext);
    const UpdateMessage = useMutation(api.workspace.UpdateWorkspaceById);
    const {userDetails, setUserDetails}=useContext(UserDetailsContext);

    const getMessages = async () => {
        const res = await convex.query(api.workspace.GetWorkspaceById, { 
            workspaceId:workspaceId as Id<"workspace"> 
        });
        setMessages(res?.messages);
        console.log("Workspace Messages:", res);
    }

    const getAiResponse = async () => {
        const res = await axios.post("/api/chat",{messages:messages});
        console.log(res.data);
        const assitantResponse =  res.data.result;
        setMessages((oldMessages: Array<Messages>) => [...oldMessages, assitantResponse]);
        await UpdateMessage({messages:[...messages,assitantResponse],workspaceId:workspaceId as Id<"workspace">});
    }

    useEffect(() => {
        if(workspaceId){
            getMessages();
        }
    },[workspaceId]);
    useEffect(() => {
        if (messages && messages.length===1) {
            const lastMessage = messages[messages.length - 1];
            
            if (lastMessage.role === 'user') {
                getAiResponse();
            }
        }
    }, [messages]);

    return (
        <div className="border rounded-md">
            <div className="p-2">
                {messages?.map((msg, index) => (
                    <div key={index} className="flex">
                        {msg.role==='user'?
                        <Image src={userDetails?.image as string} alt="user" width={30} height={30} className="rounded-full"/>
                        :
                        <span className="border w-8 h-8 rounded-full">AI</span>}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}