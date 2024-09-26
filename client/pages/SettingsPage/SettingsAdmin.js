import React, { useEffect, useState } from "react"
import { Checkbox } from "./CheckboxSettings"
// import Input from "../../component/Forms/Input";
import Button from "../../component/Button/Button"
import { Container } from "../../GlobalStyles"
import styled from "styled-components"

const SettingsAdmin = () => {
  //handles all skills received on mount from fetch,
  const [allSkills, setAllSkills] = useState([])
  //holds newSkill state that is set on Change of input value;
  const [newSkill, setNewSkill] = useState("")
  // state updates if newSkill is not set but submit clicked.
  // conditionally renders error div
  const [error, setError] = useState(false)
  //state updates if newSkill is already existing in list of allSkills
  //conditionally renders error div
  const [errorExist, setErrorExist] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [wrongEmail, setWrongEmail] = useState(false)
  const [email, setEmail] = useState(() => localStorage.getItem("email"))
  const [emailChange, setEmailChange] = useState(false)
  // email validation func, returns boolean;
  function validateEmail(str) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(str).toLowerCase())
  }

  //triggers func to fetch all skills on mount
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (error === true) {
      setTimeout(() => {
        setError(false)
      }, 1500)
    }
  }, [error])

  useEffect(() => {
    if (emailChange === true) {
      setTimeout(() => {
        setEmailChange(false)
      }, 1500)
    }
  }, [emailChange])

  useEffect(() => {
    if (errorExist === true) {
      setTimeout(() => {
        setErrorExist(false)
      }, 1500)
    }
  }, [errorExist])

  useEffect(() => {
    if (errorEmail === true) {
      setTimeout(() => {
        setErrorEmail(false)
      }, 1500)
    }
  }, [errorEmail])

  useEffect(() => {
    if (wrongEmail === true) {
      setTimeout(() => {
        setWrongEmail(false)
      }, 1500)
    }
  }, [wrongEmail])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const updateEmail = async () => {
    try {
      if (!validateEmail(email) || email === localStorage.getItem("email")) {
        setWrongEmail(true)
        return
      }
      const res = await fetch("api/updateemail", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: email,
          currentEmail: localStorage.getItem("email"),
        }),
      })
      const data = await res.json()
      if (data === true) {
        localStorage.removeItem("email")
        localStorage.setItem("email", email)
        setEmailChange(true)
        setEmail(email)
        // document.getElementsByClassName("change-email-form")[0].reset();
      } else {
        setErrorEmail(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // receives new skills and sets state to hold all skills, rerenders component on mount
  // sorts all skills in ascending order
  const fetchData = async () => {
    try {
      const res = await fetch("/api/allSkills/all")
      const response = await res.json()
      console.log("skillsinsettings", response)
      response.sort((a, b) => (a.name > b.name ? 1 : -1))
      setAllSkills(response)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value)
  }

  // func to add skill, receives skill from state that is set as value of input on change
  // receives new skills and sets state to hold all skills, rerenders component
  // sorts all skills in ascending order
  const handleUpdateSkill = async () => {
    try {
      if (!newSkill) {
        setError(true)
        return
      }
      for (let i = 0; i < allSkills.length; i++) {
        if (allSkills[i].name.toLowerCase() === newSkill.toLowerCase()) {
          setErrorExist(true)
          return
        }
      }
      const res = await fetch("api/addSkill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillName: newSkill }),
      })

      const data = await res.json()
      data.sort((a, b) => (a.name > b.name ? 1 : -1))
      setAllSkills(data)
    } catch (err) {
      console.log(err)
    }
  }

  console.log("ADMIN PAGE RENDERED")

  return (
    <Container>
      <div>
        <br />
        <PageHeading>Admin Settings</PageHeading>
        <Paragraph>
          The adjustments made here will take effect as soon as they are set.
        </Paragraph>
      </div>
      <Gap />
      <div>
        <SectionHeading>Email</SectionHeading>
        {emailChange && <div>Email successfully updated</div>}
        {errorEmail && (
          <div>Technical error occured. Please contact Support</div>
        )}
        {wrongEmail && <div>Please enter correct email</div>}
        <Grid>
          <Paragraph>Update your email here.</Paragraph>
          <InputGroup>
            <InputElement
              type="email"
              variant="with-button"
              placeholder={email}
              onChange={handleEmailChange}
            />
            <Button type="button" size="small" onClick={updateEmail}>
              Update
            </Button>
          </InputGroup>
        </Grid>
      </div>
      <Gap />
      <div>
        <SectionHeading>Add Skills to App</SectionHeading>
        <Grid>
          <Paragraph>To add a skill to the app, enter it here.</Paragraph>
          <InputGroup>
            <InputElement
              type="text"
              variant="with-button"
              placeholder="ex: Jedi mind tricks"
              onChange={handleSkillChange}
            />
            <Button type="button" size="small" onClick={handleUpdateSkill}>
              Update
            </Button>
          </InputGroup>
        </Grid>
      </div>
      <Gap />
      <SectionHeading>Remove Skills from App</SectionHeading>
      <Grid>
        <Paragraph>Select a skill to remove a skill from the app.</Paragraph>
        <div>
          {allSkills.map((skill) => {
            return (
              <Checkbox
                type="checkbox"
                key={skill._id}
                isChecked={false}
                email={email}
                label={skill.name}
              />
            )
          })}
        </div>
      </Grid>
    </Container>
  )
}

// <div className="admin-settings-internal">
//   <div className="admin-settings-skills">
//     <div className="form-title">SKILLS AVAILABLE TO USERS</div>
//     <div className="listofskills">
//       {allSkills.map((skill) => {
//         return (
//           <SkillAdmin
//             key={skill._id}
//             functionality="-"
//             handleClick={handleClick}
//             name={skill.name}
//           />
//         );
//       })}
//     </div>
//   </div>
//   <div className="admin-settings-addskill">
//     <div className="admin-settings-addcontainer">
//       <div className="form-title">CREATE A SKILL</div>
//       {error && (
//         <div className="skill-add-error">
//           Please enter skill to add to the system
//         </div>
//       )}
//       {errorExist && (
//         <div className="skill-add-error">
//           This skill already exists in the system
//         </div>
//       )}
//       <form className="password-form">
//         <input
//           type="text"
//           className="form-control-admin"
//           placeholder="Type a skill"
//           onChange={skillTyped}
//         />
//         <button
//           type="button"
//           className="skill-admin-add"
//           onClick={addSkill}
//         >
//           +
//         </button>
//       </form>
//     </div>
//   </div>
// </div>

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 20px;
  grid-template-areas: ". .";
`

const Gap = styled.hr`
  margin-top: 40px;
  margin-bottom: 40px;
  border: 1px solid #f5f5f5;
`

const PageHeading = styled.h1`
  color: #171717;
`

const SectionHeading = styled.h2`
  color: #171717;
`

const InputGroup = styled.div`
  display: flex;
`

const Paragraph = styled.p`
  color: #171717;
`

const InputElement = styled.input`
  display: block;
  width: 100%;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  padding: 10px 14px;
  margin-right: ${(props) => (props.variant === "with-button" ? "8px" : "0px")};

  &:focus {
    border: 1px solid #d6bbfb;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #f4ebff;
    border-radius: 8px;
    outline: none;
  }
`

export default SettingsAdmin
