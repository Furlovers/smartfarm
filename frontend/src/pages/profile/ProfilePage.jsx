// src/pages/ProfilePage.jsx
import { useState } from "react";
import {  FiClock } from "react-icons/fi";
import { UserMock } from "../../utils/Mocks/UserMock";
import farmerBasic from "../../assets/farmerBasic.png";
import farmerIntermediary from "../../assets/farmerIntermediary.png";
import farmerPremium from "../../assets/farmerPremium.png";
import { timestampToDate } from "../../utils/formatters/date-formatters";
import Button from "../../components/ui/Button.jsx";
import { useUser } from "../../utils/contexts/UserContext.jsx";

export default function ProfilePage() {
  const [userAvatar, setUserAvatar] = useState();
  const {fetchUserData} = useUser()
  
  const handleUserAvatar = () => {
    if (UserMock.role === "user-basic") {
      setUserAvatar(farmerBasic);
    }
    if (UserMock.role === "user-intermediary") {
      setUserAvatar(farmerIntermediary);
    }
    if (UserMock.role === "user-premium") {
      setUserAvatar(farmerPremium);
    }
  };

  useState(() => {
    handleUserAvatar();
    fetchUserData()

  }, []);

  return (
    <div className="profile-page">
      <div className="relative">
        <div
          className="h-20 w-full bg-green-600"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

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
              <h1 className="text-2xl font-bold text-gray-800">
                {UserMock.name}
              </h1>
              <p className="text-gray-600">
                {UserMock.role === "user-basic"
                  ? "Usuário Básico"
                  : UserMock.role === "user-intermediary"
                  ? "Usuário Intermediário"
                  : "Usuário Premium"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <span className="flex items-center text-sm text-gray-600">
                  <FiClock className="mr-1" /> Membro desde{" "}
                  {timestampToDate(UserMock.dateOfJoining)}
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
              defaultValue={UserMock.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={UserMock.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plano
              </label>
              <input
                type="text"
                defaultValue={
                  UserMock.role === "user-basic"
                    ? "Básico"
                    : UserMock.role === "user-intermediary"
                    ? "Intermediário"
                    : "Premium"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              defaultValue={UserMock.address}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button
          className="bg-red-500 hover:bg-red-600"
          >
            Excluir Conta
          </Button>
          <Button
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
