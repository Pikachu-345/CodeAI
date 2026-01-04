import { UserDetailsContextType, initialUserDetailsContext } from "@/types/UserDetailsContextType";
import { createContext } from "react";

export const UserDetailsContext = createContext<UserDetailsContextType>(initialUserDetailsContext);