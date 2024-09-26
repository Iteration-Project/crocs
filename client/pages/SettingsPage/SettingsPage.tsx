import type { Dispatch, SetStateAction } from "react"
import SettingsAdmin from "./SettingsAdmin"
import SettingsReg from "./SettingsReg"
import Navbar from "../../component/Navbar/Navbar"

/*
Renders Regular or Admin Settings based on admin prop from localStorage
that is set on successfull auth;
 */
interface SettingsProps {
  setAuth: Dispatch<SetStateAction<boolean>>
  auth: boolean
}

const Settings = (props: SettingsProps) => {
  const isAdmin = localStorage.getItem("admin")
  const newMessage = localStorage.getItem("newMessage")

  return (
    <div className="requestspage">
      <Navbar
        // @ts-ignore
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth}
      />

      {isAdmin === "true" && <SettingsAdmin />}
      {isAdmin !== "true" && <SettingsReg />}
    </div>
  )
}

export default Settings
