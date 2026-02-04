import { useAuth as useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useAuthContext();
  
  if (context === undefined) {
     console.error("useAuth must be used within an AuthProvider");
     // Fallback to prevent crash, but log error
     return { 
        user: null, 
        loading: true, 
        login: async () => {}, 
        logout: () => {},
        updateUser: () => {}
     };
  }
  
  return context;
};

export default useAuth;
export { useAuth };
