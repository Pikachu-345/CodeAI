"use client";

import { ChatView } from "@/components/custom/ChatView";
import { CodeView } from "@/components/custom/CodeView";

export default function Workspace() {
    return (
        <div className="h-lvh px-3 overflow-hidden">
            <div className="grid grid-cols-3 h-full gap-4 pt-15">
                <div className="col-span-1 h-full overflow-scroll no-scrollbar">
                    <ChatView/>
                </div>
                <div className="col-span-2 h-full">
                    <CodeView/>
                </div>
            </div>
        </div>
    );
};