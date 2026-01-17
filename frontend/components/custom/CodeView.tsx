import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useContext, useState } from "react";
import { Code2, Eye } from "lucide-react";
// import Dependancies from "@/constants/Dependancies"; 
// import { BASE_SandboxFiles } from "@/constants/BaseFile";
import { FilesContext } from "@/context/FilesContext";

export function CodeView() {
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
    const {files, setFiles} = useContext(FilesContext);

    return (
        <div className="h-full flex flex-col bg-[#151515] border rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-[#1e1e1e]">
                <div className="flex bg-[#2a2a2a] p-1 rounded-lg gap-1">
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "code"
                                ? "bg-[#3e3e3e] text-blue-400 shadow-sm"
                                : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        <Code2 size={14} />
                        Code
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "preview"
                                ? "bg-[#3e3e3e] text-blue-400 shadow-sm"
                                : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                </div>

                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    React Sandbox
                </div>
            </div>

            <div className="flex-1 h-screen">
                <SandpackProvider
                    files={files}
                    template="react"
                    theme="dark"
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                    }}
                    // customSetup={{ 
                    //     dependencies: {...Dependancies.DEPENDENCIES}
                    // }}
                >
                    <SandpackLayout
                        style={{
                            height: "100%",
                            borderRadius: "0px",
                            border: "none",
                        }}
                    >
                        {activeTab === "code" ? (
                            <>
                                <div className="w-50 h-scr border-r border-[#2e2e2e] bg-[#181818]">
                                    <SandpackFileExplorer className="h-full" />
                                </div>
                                <div className="flex-1 overflow-hidden h-154">
                                    <SandpackCodeEditor
                                        className="h-full"
                                        showTabs={true}
                                        showLineNumbers={true}
                                        showInlineErrors={true}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="w-full bg-white ">
                                <SandpackPreview
                                    className="h-150"
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            </div>
                        )}
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </div>
    );
}