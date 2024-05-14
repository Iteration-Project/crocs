import styled from "styled-components";

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
`;

const Input = ({ type, variant = "standard", placeholder, onChange }) => {
  console.log("INPUT RENDERED");
  return (
    <InputElement
      type={type}
      variant={variant}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
