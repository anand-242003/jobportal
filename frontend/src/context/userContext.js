"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "@/utils/axiosInstance";


const UserContext = createContext(null);


export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        setUser(data);
      } catch (error) {
        console.log("Not authenticated or session expired");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const contextValue = {
    user,
    setUser,
    loading
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};