import { FaMap, FaSun, FaFlask, FaThermometerHalf, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../../utils/contexts/SidebarContext";
import { useUser } from "../../../../utils/contexts/UserContext";

import farmerBasic from "../../../../assets/farmerBasic.png";
import farmerIntermediary from "../../../../assets/farmerIntermediary.png";
import farmerPremium from "../../../../assets/farmerPremium.png";

export default function DashSidebar() {
  const { selectedIndex, setSelectedIndex } = useSidebar();
  const navigate = useNavigate();
  const { userData, logout } = useUser();

  const menuItems = [
    { title: "MAPA", icon: <FaMap size={24} />, path: "map" },
    { title: "LUMINOSIDADE", icon: <FaSun size={24} />, path: "lum" },
    { title: "pH", icon: <FaFlask size={24} />, path: "ph" },
    { title: "TEMPERATURA", icon: <FaThermometerHalf size={24} />, path: "temp" },
  ];

  const handleNavigation = (index, path) => {
    setSelectedIndex(index);
    navigate(`/dashboard/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserAvatar = () => {
    if (userData?.role === "user-basic") return farmerBasic;
    if (userData?.role === "user-intermediary") return farmerIntermediary;
    if (userData?.role === "user-premium") return farmerPremium;
    return farmerBasic;
  };

  return (
    <div className="w-1/7 h-full bg-white absolute left-0">
      <div className="flex flex-col w-full h-screen justify-between">
        {/* Profile */}
        <div className="w-full h-1/3 justify-center p-8 flex flex-col items-center">
          <div
            onClick={() => navigate("/profile")}
            className="w-40 h-40 rounded-full overflow-hidden bg-blue-100 hover:scale-105 cursor-pointer transition-all duration-200"
          >
            <img src={getUserAvatar()} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="text-black text-md font-bold flex items-center justify-center mt-2 text-center px-2">
            {userData?.name}
          </div>
        </div>

        {/* Menu Items */}
        <div className="w-full h-1/3 flex flex-col items-end justify-center gap-2">
          {menuItems.map((item, index) => (
            <SideBarButton
              key={index}
              title={item.title}
              icon={item.icon}
              isSelected={index === selectedIndex}
              onClick={() => handleNavigation(index, item.path)}
            />
          ))}
        </div>

        {/* Logout */}
        <div className="w-full h-1/3 flex flex-col items-end justify-end pb-6">
          <SideBarButton
            title="Logout"
            icon={<FaSignOutAlt size={24} />}
            isSelected={false}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}

function SideBarButton({ title, icon, isSelected, onClick }) {
  return (
    <div
      className={`w-full h-1/6 flex flex-row cursor-pointer ${
        !isSelected && "opacity-70 hover:opacity-100 hover:scale-101 transition-all duration-200 ease-in-out"
      }`}
      onClick={onClick}
    >
      <div className={`w-2 rounded-r-sm mr-2 ${isSelected ? "bg-blue-950" : "bg-transparent"}`}></div>
      <div className={`w-[20%] h-full flex justify-center items-center ${isSelected ? "text-blue-950" : "text-gray-400"}`}>
        {icon}
      </div>
      <div className="w-[80%] h-full flex items-center justify-start pl-2">
        <h1 className={`font-bold ${isSelected ? "text-blue-950" : "text-gray-400"}`}>
          {title}
        </h1>
      </div>
    </div>
  );
}
