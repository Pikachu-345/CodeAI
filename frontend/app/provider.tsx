"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailsType } from "@/types/UserDetailsContextType";

function Provider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([]);
    const [userDetails, setUserDetails] = React.useState< UserDetailsType | null>(null);
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
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Header />
                        {children}
                    </ThemeProvider>
                </MessagesContext.Provider>
            </UserDetailsContext.Provider>
        </GoogleOAuthProvider>
    );
};

export default Provider;
