import { ChatView } from "@/components/custom/ChatView";
import { CodeView } from "@/components/custom/CodeView";

export default function Workspace() {
    return ( 
        <div suppressHydrationWarning={true} className="pt-15 px-5">
            <div className="grid grid-cols-2">
                <ChatView/>
                <CodeView/>
            </div>
        </div>
    );
};