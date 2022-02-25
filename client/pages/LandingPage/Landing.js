import React, { useState } from "react";
import PropTypes from "prop-types";
import { data } from "./Data";
import Button from "../../component/Button/Button";
import ButtonGroup from "../../component/Button/ButtonGroup";
import Modal from "../../component/Modal/Modal";
import Login from "../../component/Forms/Login";
import Signup from "../../component/Forms/Signup";
import { Container } from "../../GlobalStyles";
import {
  InfoSec,
  InfoRow,
  InfoColumn,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  ImgWrapper,
  Img,
} from "./Landing.elements";

function Landing({ auth, setAuth, setCurrentUser }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  return (
    <>
      <InfoSec lightBg={data.lightBg}>
        {showLoginModal && (
          <Modal close={() => setShowLoginModal(false)}>
            <Login setCurrentUser={setCurrentUser} setAuth={setAuth}></Login>
          </Modal>
        )}
        {showRegistrationModal && (
          <Modal close={() => setShowRegistrationModal(false)}>
            <Signup
              setCurrentUser={setCurrentUser}
              auth={auth}
              setAuth={setAuth}
            ></Signup>
          </Modal>
        )}
        <Container>
          <InfoRow imgStart={data.imgStart}>
            <InfoColumn>
              <TextWrapper>
                <TopLine lightTopLine={data.lightTopLine}>
                  {data.topLine}
                </TopLine>
                <Heading lightText={data.lightText}>{data.headline}</Heading>
                <Subtitle lightTextDesc={data.lightTextDesc}>
                  {data.description}
                </Subtitle>
                <ButtonGroup>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    variant="fill"
                    size="medium"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowRegistrationModal(true)}
                    variant="fill"
                    size="medium"
                  >
                    Sign Up
                  </Button>
                </ButtonGroup>
              </TextWrapper>
            </InfoColumn>
            <InfoColumn>
              <ImgWrapper start={data.start}>
                <Img src={data.img} alt={data.alt} />
              </ImgWrapper>
            </InfoColumn>
          </InfoRow>
        </Container>
      </InfoSec>
    </>
  );
}

Landing.propTypes = {
  auth: PropTypes.bool,
  setAuth: PropTypes.func,
  setCurrentUser: PropTypes.func,
};
export default Landing;
