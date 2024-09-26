import React, { useState } from "react"
import logo from "../../images/logo-graph.png"
import Button from "../Button/Button"
import {
  Nav,
  NavbarContainer,
  NavIcon,
  NavLogo,
  NavMenu,
  NavItem,
  NavLinks,
} from "./Navbar.elements"

function Navbar({ setAuth, setCurrentUser }) {
  const [click, setClick] = useState(false)

  const handleClick = () => setClick(!click)

  return (
    <>
      <Nav>
        <NavbarContainer>
          <NavLogo to="/">
            <NavIcon src={logo} alt="scratchLogo" />
          </NavLogo>
          <NavMenu onClick={handleClick} click={click}>
            <NavItem>
              <NavLinks to="/settings">Settings</NavLinks>
            </NavItem>
            <NavItem>
              <Button
                variant="fill"
                size="medium"
                onClick={() => {
                  localStorage.clear()
                  setAuth(false)
                  setCurrentUser(null)
                }}
              >
                Log Out
              </Button>
            </NavItem>
          </NavMenu>
        </NavbarContainer>
      </Nav>
    </>
  )
}

export default Navbar
