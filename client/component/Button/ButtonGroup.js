import PropTypes from "prop-types";
import styled from "styled-components";

const GroupElement = styled.div`
  display: flex;

  > * {
    margin-right: 8px;
  }
`;

const ButtonGroup = ({ children }) => {
  return <GroupElement>{children}</GroupElement>;
};

ButtonGroup.propTypes = {
  children: PropTypes.node,
};

export default ButtonGroup;
