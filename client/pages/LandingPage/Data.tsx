
export interface IData {
  lightBg: boolean;
  primary: boolean;
  lightTopLine: boolean;
  lightText: boolean;
  lightTextDesc: boolean;
  imgStart: string;
  topLine: string;
  headline: string;
  description: string;
  buttonLabel: string;
  imageStart?: string;
  img?: string;
  alt?: string;
  start?: string;
}

export const data: IData = {
  primary: false,
  lightBg: true,
  lightTopLine: false,
  lightText: false,
  lightTextDesc: false,
  topLine: "Cohort Connect",
  headline: "We are on this learning journey together",
  description:
    "Don't miss an opportunity to learn from others. Join Cohort Connect to see what others in your cohort have to teach you.",
  buttonLabel: "Get Started",
  imgStart: "",
  img: require("../../images/undraw_connecting_teams.svg"),
  alt: "Credit Card",
  start: "",
};
