export interface MessagesContextType {
  messages: Array<{ role: string; content: string }>;
  setMessages: (newMessages: Array<{ role: string; content: string }>) => void;
}

export const initialMessagesContext: MessagesContextType = {
  messages: [],
  setMessages: () => {},
};