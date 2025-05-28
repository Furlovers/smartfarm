import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ForumPage from "./pages/forum/ForumPage";
import MapPage from "./pages/dashboard/mapPage";
import TemperaturePage from "./pages/dashboard/tempPage";
import { SidebarProvider } from "./utils/contexts/SidebarContext";
import LumPage from "./pages/dashboard/lumPage";
import PhPage from "./pages/dashboard/phPage";
import BateryPage from "./pages/dashboard/batPage";
import { UserProvider } from "./utils/contexts/UserContext";
import { SensorProvider } from "./utils/contexts/SensorContext";
import { ReadingListProvider } from "./utils/contexts/ReadingListContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <SensorProvider>
          <ReadingListProvider>
            {" "}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <SidebarProvider>
                    <DashboardPage />
                  </SidebarProvider>
                }
              >
                <Route path="map" element={<MapPage />} />
                <Route path="temp" element={<TemperaturePage />} />
                <Route path="lum" element={<LumPage />} />
                <Route path="ph" element={<PhPage />} />
                <Route path="bat" element={<BateryPage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forum" element={<ForumPage />} />
            </Routes>
          </ReadingListProvider>
        </SensorProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
