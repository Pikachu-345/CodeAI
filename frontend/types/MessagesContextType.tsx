import { Dispatch } from "react";

export interface Messages {
    role: string; 
    content: string; 
}

export interface MessagesContextType {
  messages: Array<Messages>;
  setMessages: Dispatch<React.SetStateAction<Array<Messages>>>;
}

export const initialMessagesContext: MessagesContextType = {
  messages: [],
  setMessages: () => {},
};