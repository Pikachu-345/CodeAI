"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

function Provider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([]);
    const [userDetails, setUserDetails] = React.useState<{ name: string; email: string; age: number } | null>(null);
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
