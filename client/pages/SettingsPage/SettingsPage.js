import PropTypes from "prop-types";
import SettingsAdmin from "./SettingsAdmin";
import SettingsReg from "./SettingsReg";
import Navbar from "../../component/Navbar/Navbar";

/*
Renders Regular or Admin Settings based on admin prop from localStorage
that is set on successfull auth;
 */

const Settings = (props) => {
  const isAdmin = localStorage.getItem("admin");
  const newMessage = localStorage.getItem("newMessage");

  return (
    <div className="requestspage">
      <Navbar
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth}
      />

      {isAdmin === "true" && <SettingsAdmin />}
      {isAdmin !== "true" && <SettingsReg />}
    </div>
  );
};

Settings.propTypes = {
  setAuth: PropTypes.func,
};
export default Settings;
