import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import React from "react";

interface SignInDialogProps {
    openDialog: boolean;
    closeDialog: () => void;
}

const SignInDialog = ( {openDialog, closeDialog}:SignInDialogProps ) => {
    const {userDetails, setUserDetails} = React.useContext(UserDetailsContext);
    
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } },
            );

            console.log(userInfo);
            setUserDetails(userInfo.data);
            closeDialog()
        },
        onError: errorResponse => console.log(errorResponse),
    });
    return (
        <Dialog open={openDialog} onOpenChange={() => {closeDialog()}}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                    <div className="flex items-center flex-col">
                        <h2 className="font-bold text-xl">Continue with CodeAI</h2>
                        <h2 className="text-gray-400 text-sm">You need to sign in to CodeAI first.</h2>
                        <Button 
                            className="mt-2 cursor-pointer" 
                            onClick={() => googleLogin()}
                        >
                            Sign in with Google
                        </Button>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default SignInDialog;