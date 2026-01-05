import { Id } from "@/convex/_generated/dataModel";

export interface UserDetailsType {
    _id: Id<"users">;
    _creationTime: number;
    name: string;
    email: string;
    image: string;
    uid: string;
}

export interface UserDetailsContextType {
    userDetails: UserDetailsType | null;
    setUserDetails: (details: UserDetailsType | null) => void;
};

export const initialUserDetailsContext: UserDetailsContextType = {
    userDetails: null,
    setUserDetails: () => {},
}; 