import { Outlet } from "react-router-dom"
import { FaThermometerHalf, FaSun, FaFlask, FaBatteryFull, FaMap } from "react-icons/fa"
import DashSidebar from "./components/sidebar/dashSidebar"
import { useUser } from "../../utils/contexts/UserContext"
import { useEffect } from "react"

export default function DashboardPage() {

    const {fetchUserData} = useUser()

    useEffect(() => {
        fetchUserData()
    }, [])


    return (
    <div className="w-screen h-screen relative">
        <DashSidebar/>
        <div className="w-6/7 h-screen  absolute right-0">
            <Outlet/>
        </div>
    </div>

           )
}
