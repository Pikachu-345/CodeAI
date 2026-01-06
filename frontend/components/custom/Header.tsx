import { useContext } from "react";
import { Button } from "../ui/button";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import Image from "next/image";

function Header() {
    const {userDetails, setUserDetails} = useContext(UserDetailsContext);
  return (
    <header className="fixed w-full flex items-center justify-between p-4">
        <h1>CodeAI</h1>
        <div className="flex gap-x-3">
            {userDetails ?
                userDetails.image && <Image src={userDetails.image} alt="User" width={32} height={32} className="rounded-full" />
                :
                <div className="flex items-center gap-x-2">
                    <Button variant="default">Sign In</Button>
                    <Button variant="default">Get Started</Button>
                </div>
            }
        </div>
    </header>
  );
};

export default Header;