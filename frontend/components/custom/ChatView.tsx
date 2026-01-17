"use client";

import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Messages } from "@/types/MessagesContextType";
// import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ArrowUpIcon, Plus } from "lucide-react";
import { InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { parseResponse } from "@/lib/parser";
import { FilesContext } from "@/context/FilesContext";

export function ChatView() {
    const {workspaceId} = useParams();
    const convex = useConvex();
    const {messages,setMessages}=useContext(MessagesContext);
    const UpdateMessage = useMutation(api.workspace.UpdateWorkspaceById);
    const {userDetails, setUserDetails}=useContext(UserDetailsContext);
    const {files,setFiles} = useContext(FilesContext);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);

    const getMessages = async () => {
        const res = await convex.query(api.workspace.GetWorkspaceById, { 
            workspaceId:workspaceId as Id<"workspace"> 
        });
        setMessages(res?.messages);
        // console.log("Workspace Messages:", res);
    }

    const getAiResponse = async () => {
        setLoading(true);
        try {
            let currentFiles = { ...files };
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: messages }),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunkValue = decoder.decode(value, { stream: true });
                accumulatedResponse += chunkValue;

                const { text, steps } = parseResponse(accumulatedResponse);

                setMessages((prev) => {
                    const newMsgs = [...prev];
                    const lastMsg = newMsgs[newMsgs.length - 1];
                    if (lastMsg && lastMsg.role === "assistant") {
                        newMsgs[newMsgs.length - 1] = {
                            ...lastMsg,
                            content: text
                        };
                        return newMsgs;
                    }
                    return [...prev, { role: "assistant", content: text }];
                });

                // 4. Update Sandbox Files
                if (steps.length > 0) {
                    steps.forEach((step) => {
                        currentFiles[step.filePath] = {
                            code: step.content,
                            active: true
                        };
                    });
                    setFiles((prevFiles) => {
                        const newFiles = { ...prevFiles };
                        steps.forEach((step) => {
                            newFiles[step.filePath] = { 
                                code: step.content, 
                                active: true 
                            };
                        });
                        return newFiles;
                    });
                }
            }

            await UpdateMessage({
                messages: [...messages, { role: "assistant", content: accumulatedResponse }],
                workspaceId: workspaceId as Id<"workspace">,
                files: currentFiles
            });

        } catch (error) {
            console.error("AI Generation Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const callAi = () => {
        if (!userPrompt.trim()) return;

        const newMsg: Messages = { role: "user", content: userPrompt };
        
        setMessages((prev) => [...prev, newMsg]);
        
        setUserPrompt("");
        setLoading(true);
    };

    useEffect(() => {
        if(workspaceId){
            getMessages();
        }
    },[workspaceId]);

    useEffect(() => {
        if (messages && messages.length>0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user' && !loading) {
                getAiResponse();
                setLoading(false);
            }
        }
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-full bg-background border rounded-xl shadow-sm">
            <div className="overflow-y-auto py-1 px-2 space-y-1 no-scrollbar">
                {messages?.map((msg, index) => (
                    <div key={index} className="flex items-start gap-1">
                        {msg.role === 'user' ? (
                            <Image 
                                src={userDetails?.image as string} 
                                alt="user" width={32} height={32} 
                                className="rounded-full shrink-0 mt-1"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 shrink-0 mt-1">
                                <span className="text-[9px] font-bold text-white">AI</span>
                            </div>
                        )}
                        <div className={`flex flex-col gap-1 max-w-[85%]`}>
                            <h2 className={`text-sm leading-relaxed py-1 px-2 rounded-md ${
                                msg.role === 'user' 
                                ? 'bg-secondary/50 text-secondary-foreground' 
                                : 'bg-muted/30 border border-border/50'
                            }`}>
                                {msg.content}
                            </h2>
                        </div>
                    </div>
                ))}
                {loading && <div className="animate-spin duration-200">A</div>}
            </div>

            <div className="p-2 border-t bg-background">
                <div className="relative flex flex-col gap-2 p-2 border rounded-xl bg-muted/20 focus-within:border-primary/50 transition-colors">
                    <InputGroupTextarea 
                        value={userPrompt}
                        onChange={(e)=>setUserPrompt(e.target.value)}
                        placeholder="Ask, Search or Chat..." 
                        className="bg-transparent border-none focus-visible:ring-0 min-h-15 resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        <InputGroupButton
                            variant="ghost"
                            size="icon-xs"
                            className="rounded-lg h-8 w-8"
                        >
                            <Plus size={18} />
                        </InputGroupButton>
                        
                        <div className="flex items-center gap-2">
                            <Separator orientation="vertical" className="h-4" />
                            <InputGroupButton
                                onClick={()=>callAi()}
                                variant="default"
                                size="icon-sm"
                                className="rounded-lg h-8 w-8 bg-primary cursor-pointer hover:bg-primary/90"
                                disabled={!userPrompt}
                            >
                                <ArrowUpIcon size={16}/>
                            </InputGroupButton>
                        </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                        AI can make mistakes. Verify important info.
                    </p>
                </div>
                
            </div>
        </div>
    );
}