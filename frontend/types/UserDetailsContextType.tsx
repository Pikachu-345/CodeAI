export interface UserDetailsContextType {
    userDetails: {
        name: string;
        email: string;
        age: number;
    } | null;
    setUserDetails: (details: { name: string; email: string; age: number } | null) => void;
};

export const initialUserDetailsContext: UserDetailsContextType = {
    userDetails: null,
    setUserDetails: () => {},
}; 