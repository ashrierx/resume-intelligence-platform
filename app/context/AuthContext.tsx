import { useContext, createContext, useState, ReactNode } from "react";
import { User } from "@/types/auth";

type AuthContextType = {
  user: User | null;
  isLoginOpen: boolean;
  setAuth: (authUser: User | null) => void;
  openLogin: () => void;
  closeLogin: () => void;
  logout: () => void;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  const openLogin = () => setIsLoginOpen(true);

  const closeLogin = () => setIsLoginOpen(false);

  const logout = () => {
    setUser(null);
    // Additional logout logic (e.g., clear tokens, redirect)
  };

  const login = (email: string, password: string) => {
    // Placeholder for login logic (e.g., API call)
    // On success, call setAuth with user data
  };

  const signup = (name: string, email: string, password: string) => {
    // Placeholder for signup logic (e.g., API call)
    // On success, call setAuth with user data
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setAuth,
        openLogin,
        closeLogin,
        isLoginOpen,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
// Guard to tell Typescript the return value will never be null
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
