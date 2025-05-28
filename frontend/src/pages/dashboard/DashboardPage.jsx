import { Outlet } from "react-router-dom"
import { FaThermometerHalf, FaSun, FaFlask, FaBatteryFull, FaMap } from "react-icons/fa"
import DashSidebar from "./components/sidebar/dashSidebar"
import { useUser } from "../../utils/contexts/UserContext"
import { use, useEffect } from "react"
import { useSensor } from "../../utils/contexts/SensorContext"

export default function DashboardPage() {

    const {fetchUserData, userData} = useUser()
    const {fetchSensorData} = useSensor()

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {   
        fetchSensorData()
    }, [userData])

    return (
    <div className="w-screen h-screen relative">
        <DashSidebar/>
        <div className="w-6/7 h-screen  absolute right-0">
            <Outlet/>
        </div>
    </div>

           )
}
