import { initialMessagesContext, MessagesContextType } from "@/types/MessagesContextType";
import { createContext } from "react";

export const MessagesContext = createContext<MessagesContextType>(initialMessagesContext);