import { MessagesContext } from "@/context/MessagesContext";
import { ArrowRight, Link } from "lucide-react";
import React from "react";
import SignInDialog from "./SignInDialog";

const SUGGESTIONS = [
    "Create a simple todo app.",
    "Create an expense tracker.",
    "Create a simple blogging app.",
    "Create a weather app.",
    "Create a simple calculator app."
];

function Hero() {
    const [userInput, setUserInput] = React.useState("");
    const {messages, setMessages} = React.useContext(MessagesContext);
    const {userDetails, setUserDetails} = React.useContext(MessagesContext);
    const [openDialog, setOpenDialog] = React.useState(false);

    const onSubmit = (input:string) => {
        if(!userDetails){
            setOpenDialog(true);
            return;
        }
        setMessages([...messages, { role: "user", content: input }]);
        setUserInput("");
    };

    return (
        <section className="h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-2xl flex gap-y-2 flex-col items-center">
                <h1 className="text-5xl font-bold">What's on you mind today? </h1>
                <p className="text-gray-400 font-medium mb-4">Build and code you application with the power of AI.</p>
                <div className="p-5 border rounded-xl w-full">
                    <div className="flex gap-2">
                        <textarea
                            onChange={(event)=>setUserInput(event.target.value)}
                            value={userInput}
                            placeholder="Create a simple todo app with React and Tailwind CSS"
                            className="outline-none resize-none bg-transparent w-full h-32 max-h-56 flex-1"
                        />
                        {userInput && 
                        <ArrowRight 
                            onClick={() => onSubmit(userInput)}
                            className="bg-blue-400 p-2 h-8 w-8 rounded-md cursor-pointer hover:bg-blue-500 duration-200"
                        ></ArrowRight>}
                    </div>
                    <div>
                        <Link className="h-5 w-5 cursor-pointer"></Link>
                    </div>
                </div>
            </div>
            <div className="max-w-xl flex flex-wrap mt-3 justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                    <p 
                        key={suggestion}
                        onClick={() => onSubmit(suggestion)}
                        className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white duration-200 cursor-pointer"
                    >
                        {suggestion}    
                    </p>
                ))}
            </div>
            <SignInDialog openDialog={openDialog} 
            closeDialog={() => setOpenDialog(false)} />
        </section>
    );
};

export default Hero;