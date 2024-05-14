"";
import styled from "styled-components";

export const FormEelement = styled.form`
  width: 400px;
  border: 1px dotted silver;
  padding: 26px 32px 32px;
  border-radius: 2px;
`;

const Form = ({ children }) => <FormEelement> {children} </FormEelement>;

export default Form;
