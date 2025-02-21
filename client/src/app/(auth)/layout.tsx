import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthLayoutProps {
    children: React.ReactNode;
}


export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
       <div className="absolute top-6 right-6">
            <ThemeToggle />
        </div> 
      {children}
    </div>
  );
}