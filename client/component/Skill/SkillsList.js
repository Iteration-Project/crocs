import React, { useState } from "react";
import styled from "styled-components";
import SkillButton from "./SkillButtonMain";

/*
component is rendered on MainPage;
onClick on button which is skill will fetch GraphData and pass it to parent component to rerender ForceGraph;
 */
const SkillsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 0 20px 0;
`;

const SkillsInnerContainer = styled.div`
  max-width: 800px;
  max-height: 80px;
  margin-top: 20px;
`;

const ButtonStyled = styled.button`
  background: ${(p) => (p.selected ? "#5c93f0" : "white")};
  border: 1px solid #5c93f0;
  color: ${(p) => (p.selected ? "white" : "#5c93f0")};
  border-radius: 20px;
  height: 40px;
  padding: 0px 16px;
  margin: 0.3vh 0.3vw;
  &:hover {
    background: #5c93f0;
    color: white;
  }
`;

const SkillsList = (props) => {
  const [allSkills, setAllSkills] = useState(props.skills);
  const [classname, setClassName] = useState("skillslist-button");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selected, setSelected] = useState(false);

  const handleClick = async (e) => {
    try {
      const selectedSkill = e.target.innerHTML;
      console.log("Selected skill ", selectedSkill);
      props.setSelectedUser({});
      if (!selected) {
        setSelected(true);
        // Filter the graph
        const resp = await fetch("/api/nodes/" + selectedSkill);
        const data = await resp.json();
        props.setGraphData(data);
      } else {
        setSelected(false);
        // Unfilter the graph
        const resp = await fetch("/api/nodes/all");
        const data = await resp.json();
        props.setGraphData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SkillsContainer>
      <SkillsInnerContainer>
        {allSkills.map((skill) => (
          <SkillButton
            type="button"
            key={skill}
            id={skill}
            setSelectedUser={props.setSelectedUser}
            selectedSkill={selectedSkill}
            setGraphData={props.setGraphData}
            selected={selected}
            onClick={handleClick}
          >
            {skill}
          </SkillButton>
        ))}
      </SkillsInnerContainer>
    </SkillsContainer>
  );
};

export default SkillsList;
