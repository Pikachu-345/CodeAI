import { Button } from "../ui/button";

function Header() {
  return (
    <header className="fixed w-full flex items-center justify-between p-4">
        <h1>CodeAI</h1>
        <div className="flex gap-x-3">
            <Button variant="default">Sign In</Button>
            <Button variant="default">Get Started</Button>
        </div>
    </header>
  );
};

export default Header;