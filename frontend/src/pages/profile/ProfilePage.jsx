import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import farmerBasic from "../../assets/farmerBasic.png";
import farmerIntermediary from "../../assets/farmerIntermediary.png";
import farmerPremium from "../../assets/farmerPremium.png";
import { timestampToDate } from "../../utils/formatters/date-formatters";
import Button from "../../components/ui/Button.jsx";
import { useUser } from "../../utils/contexts/UserContext.jsx";
import ConfirmationBox from "../../components/ConfirmationBox.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const [userAvatar, setUserAvatar] = useState();
  const {
    fetchUserData,
    updateProfile,
    setUserData,
    userData,
    deleteUser,
    loading,
    logout
  } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSaveChanges = () => {
    const updatedUserData = { name, email, address };
    setUserData(updatedUserData);
    updateProfile(updatedUserData);
  };

  const handleDeleteUser = () => {
    deleteUser();
    setConfirmOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserAvatar = () => {
    if (userData.role === "user-basic") setUserAvatar(farmerBasic);
    else if (userData.role === "user-intermediary")
      setUserAvatar(farmerIntermediary);
    else if (userData.role === "user-premium") setUserAvatar(farmerPremium);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setAddress(userData.address || "");
      handleUserAvatar();
    }
  }, [userData]);

  if (loading || userData === null) {
    return <LoadingScreen />;
  }

  return (
    <div className="profile-page bg-gray-100">
      <div className="relative">
        <div className="h-20 w-full bg-blue-950"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 relative z-10">
            <div className="relative">
              <img
                src={userAvatar}
                className="w-50 h-50 rounded-full border-4 border-white shadow-lg"
                alt="Avatar do usuário"
              />
            </div>

            <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
              </div>
              <p className="text-gray-600">
                {userData.role === "user-basic"
                  ? "Usuário Básico"
                  : userData.role === "user-intermediary"
                  ? "Usuário Intermediário"
                  : "Usuário Premium"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <span className="flex items-center text-sm text-gray-600">
                  <FiClock className="mr-1" />
                  Membro desde {timestampToDate(userData.dateOfJoining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <div className="bg-white p-6 rounded-md shadow-sm space-y-4">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plano
              </label>
              <input
                type="text"
                value={
                  userData.role === "user-basic"
                    ? "Básico"
                    : userData.role === "user-intermediary"
                    ? "Intermediário"
                    : "Premium"
                }
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t m-4">
            <Button
              onClick={() => setConfirmOpen(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir Conta
            </Button>
            <Button
              onClick={handleSaveChanges}
              background="bg-blue-950"
              hover="hover:bg-blue-800"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <div className="w-full flex justify-between items-center px-4">
            <div
              className="h-12 flex flex-row items-center cursor-pointer 
    hover:opacity-100 hover:scale-101 transition-all duration-200 ease-in-out opacity-80"
              onClick={handleLogout}
            >
              <div className="w-2 rounded-r-sm mr-2 bg-blue-950"></div>
              <div className="w-[20%] h-full flex justify-center items-center text-blue-950">
                <FaSignOutAlt />
              </div>
              <div className="w-[80%] h-full flex items-center justify-start pl-2">
                <h1 className="font-bold text-blue-950">Logout</h1>
              </div>
            </div>

            <div
              onClick={() => navigate("/dashboard/map")}
              className="w-[250px] h-12 flex flex-row items-center cursor-pointer 
      hover:opacity-100 hover:scale-101 transition-all duration-200 ease-in-out opacity-80"
            >
              <div className="w-2 rounded-r-sm mr-2 bg-blue-950"></div>
              <div className="w-[20%] h-full flex justify-center items-center text-blue-950">
                <FaChevronLeft />
              </div>
              <div className="w-[80%] h-full flex items-center justify-start">
                <h1 className="font-bold text-blue-950">Voltar ao Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmationBox
          message="Tem certeza que deseja excluir sua conta?"
          onConfirm={handleDeleteUser}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
