"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailsType } from "@/types/UserDetailsContextType";
import { FileMap } from "@/types/FilesContextType";
import { BASE_SandboxFiles } from "@/constants/BaseFile";
import { FilesContext } from "@/context/FilesContext";

function Provider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [userDetails, setUserDetails] = useState< UserDetailsType | null>(null);
    const [files, setFiles] = useState<FileMap>(BASE_SandboxFiles);
    const convex = useConvex();

    const IsAuthenticated = async () => {
        if(typeof window !== 'undefined') {
            const storedUserInfo = localStorage.getItem('userInfo');
            if(storedUserInfo) {
                const localUserInfo = JSON.parse(storedUserInfo);
                const dbUserInfo = await convex.query(api.users.GetUserByEmail, { 
                    email: localUserInfo?.email
                });
                setUserDetails(dbUserInfo);
                // console.log("Authenticated User:", dbUserInfo);
            }
        }
    }
    useEffect(() => {
        IsAuthenticated();
    }, []);
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || ""}>
            <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
                <MessagesContext.Provider value={{ messages, setMessages }}>
                    <FilesContext.Provider value={{ files, setFiles }}>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Header />
                            {children}
                        </ThemeProvider>
                    </FilesContext.Provider>
                </MessagesContext.Provider>
            </UserDetailsContext.Provider>
        </GoogleOAuthProvider>
    );
};

export default Provider;
