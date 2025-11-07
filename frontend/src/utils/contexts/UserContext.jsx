import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserMock } from "../Mocks/UserMock";
import axios from "axios";
import { userAPI } from "../constants/axios-instance";
import { viewAPI } from "../constants/axios-instance";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [dashboardFilterInitialData, setDashboardFilterInitialData] =
    useState(null);
  const [dashboardFilterFinalData, setDashboardFilterFinalData] =
    useState(null);

    

  useEffect(() => {
    if (userData === null) {
      fetchUserData();
    }

  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const response = await viewAPI.get("/get_user_view/" + localStorage.getItem("userId"));
      setUserData(response.data);

      setError(null);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await userAPI.post("/login", {
        email: credentials.email,
        password: credentials.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.userId);

      

      await fetchUserData();

      

      navigate("/dashboard/map");

      setDashboardFilterInitialData(userData?.sensorList[0]?.readingList[0]);
      setDashboardFilterFinalData(
        userData?.sensorList[0]?.readingList[
          userData?.sensorList[0]?.readingsList.length - 1
        ]
      );
      
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userAPI.post("/register", userData);
      setUserData(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserData(null);
    navigate("/");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await userAPI.put(
        "/" + localStorage.getItem("userId"),
        userData
      );
      setUserData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error ao atualizar o perfil");
      throw error;
    } finally {
      setLoading();
    }
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    setError(error.response?.data?.message || "Erro de autenticação");
  };

  const deleteUser = async () => {
    try {
      setLoading(true);
      await userAPI.delete("/" + localStorage.getItem("userId"));
      logout();
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao deletar o usuário");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userData,
    loading,
    error,
    login,
    logout,
    updateProfile,
    register,
    isAuthenticated: !!userData,
    fetchUserData,
    setUserData,
    deleteUser,
    dashboardFilterInitialData,
    setDashboardFilterInitialData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
