import React, { useState } from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  background: ${(p) =>
    p.stat === "inactiveskillbutton" ? "white" : "#ede6ff"};
  border: 1px solid #7f56d9;
  color: #7f56d9;
  border-radius: 3px;
  font-weight: ${(p) => (p.stat === "inactiveskillbutton" ? "400" : "600")};
  height: 25px;
  margin: 0.2vh 0.2vw;
`;

/*
rendered in PopUpReg component
onClick trigers OnClick of parent component passing it's id(skill id)
and changes it's state to change class and render different style of component
 */

const SkillButton = (props) => {
  const [stat, setStat] = useState("inactiveskillbutton");
  const clicked = (e) => {
    props.onClick(e.target.id);
    console.log(stat);
    stat === "inactiveskillbutton"
      ? setStat("activeskillbutton")
      : setStat("inactiveskillbutton");
  };
  return (
    <ButtonStyled type="button" id={props.id} stat={stat} onClick={clicked}>
      {props.skill}
    </ButtonStyled>
  );
};

export default SkillButton;
