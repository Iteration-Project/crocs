import styled from "styled-components";

const LabelElement = styled.label`
  display: block;
  margin-bottom: 16px;
`;

const Label = ({ children }) => {
  return <LabelElement>{children}</LabelElement>;
};

export default Label;
