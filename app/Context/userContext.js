"use client"
import { useEffect , useState } from "react";
import { createContext , useContext } from "react";
const userContext = createContext();

export function UserProvider({ children }) {
   const [user, setuser] = useState([]);
useEffect(()=> {
  async function getUserDetails() {
    const userId = localStorage.userId
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userDetails/${userId}`);
    const data = await res.json();
    setuser(data);
  }
  getUserDetails();
}, []);
return (
    <userContext.Provider value={{user, setuser}}>{children}</userContext.Provider>
)
}
export const useUser = ()=> useContext(userContext);