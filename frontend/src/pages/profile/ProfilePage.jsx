import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import farmerBasic from "../../assets/farmerBasic.png";
import farmerIntermediary from "../../assets/farmerIntermediary.png";
import farmerPremium from "../../assets/farmerPremium.png";
import { timestampToDate } from "../../utils/formatters/date-formatters";
import Button from "../../components/ui/Button.jsx";
import { useUser } from "../../utils/contexts/UserContext.jsx";

export default function ProfilePage() {
  const [userAvatar, setUserAvatar] = useState();
  const { fetchUserData, updateProfile, setUserData, userData, deleteUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSaveChanges = () => {
    const updatedUserData = {
      name,
      email,
      address,
    };
    setUserData(updatedUserData);
    updateProfile(updatedUserData);
  };

  const handleUserAvatar = () => {
    if (userData.role === "user-basic") setUserAvatar(farmerBasic);
    if (userData.role === "user-intermediary") setUserAvatar(farmerIntermediary);
    if (userData.role === "user-premium") setUserAvatar(farmerPremium);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Atualiza os campos e avatar assim que userData for carregado
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setAddress(userData.address || "");
      handleUserAvatar();
    }
  }, [userData]);

  return (
    <div className="profile-page">
      <div className="relative">
        <div className="h-20 w-full bg-green-600"></div>

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
              <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
              <p className="text-gray-600">
                {userData.role === "user-basic"
                  ? "Usuário Básico"
                  : userData.role === "user-intermediary"
                  ? "Usuário Intermediário"
                  : "Usuário Premium"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <span className="flex items-center text-sm text-gray-600">
                  <FiClock className="mr-1" /> Membro desde{" "}
                  {timestampToDate(userData.dateOfJoining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
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

        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button 
          onClick={() => deleteUser()}
          className="bg-red-500 hover:bg-red-600">Excluir Conta</Button>
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </div>
      </div>
    </div>
  );
}
