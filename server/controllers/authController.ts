const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Skill = require("../models/skillModel");
import type {Request, Response, NextFunction} from "express";

interface AuthController {
  verifyUser: (req: Request, res: Response, next: NextFunction) => Promise<ReturnType<NextFunction>>
}

const authController: AuthController = {
  async verifyUser(req, res, next) {
    try {
      // console.log("verifyUser START");
      const { email, password } = req.body;
      if (!email || !password) {
        res.locals.verification = {
          hasLogged: false,
        };
        return next();
      }
  
      // object specifying the fields to be requested from db
      const specifiedFields = {
        _id: 0,
        name: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        isAdmin: 1,
        newMessages: 1,
      };
  
      const verification = {
        hasLogged: false,
      };
  
      const user = await User.findOne({ email });
  
      // console.log("FOUND USER ", user);
  
      const verifiedUser = await user.verify(password);
      // console.log("verifiedUser ", verifiedUser);
  
      if (!user || (await user.verify(password)) === false) {
        verification.hasLogged = false;
        res.locals.verification = verification;
        return next();
      } else if (user && (await user.verify(password)) === true) {
        verification.hasLogged = true;
        verification.userInfo = {};
        for (const key in specifiedFields) {
          verification.userInfo[key] = user[key];
        }
  
        // if (user.newMessages) {
        //   await User.updateOne({ email }, { $set: { newMessages: false } });
        // }
  
        res.locals.verification = verification;
        // console.log("verification ", res.locals.verification);
        return next();
      }
      // console.log("verifyUser END");
    } catch (err) {
      return next(err);
    }
  },
  async createUser(req, res, next) {
    try {
      // console.log("createUser START");
      const { email, password, firstName, lastName, skillsToTeach } = req.body;
      const verification = {
        hasLogged: false,
      };
  
      if (!email || !password || !firstName || !lastName) {
        // console.log("Missing information");
        res.locals.verification = {
          hasLogged: "empty",
        };
        return next();
      }
      if (!validateEmail(email)) {
        // console.log("Cannot validate email");
        verification.hasLogged = "format";
        res.locals.verification = verification;
        return next();
      }
  
      const teach = [];
      for (const key in skillsToTeach) {
        teach.push({
          name: key,
          _id: mongoose.Types.ObjectId(skillsToTeach[key]),
        });
      }
  
      // object specifying the filters on query
      const userDoc = {
        email,
        password,
        firstName,
        lastName,
        teach,
      };
  
      // object specifying the fields to be returned from db
      const specifiedFields = {
        name: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        isAdmin: 1,
        newMessages: 1,
      };
  
      const emailExist = await User.findOne({ email });
      // console.log("emailExists ", emailExist);
  
      if (emailExist) {
        res.locals.verification = verification;
        // console.log("email verification ", res.locals.verification);
        return next();
      }
  
      const user = await User.create(userDoc);
  
      // update teachers in skill to reflect the new user
      const newTeacher = {
        firstName,
        lastName,
        email,
        _id: user._id,
      };
  
      const skills = Object.keys(skillsToTeach);
      if (skills.length != 0) {
        await Skill.updateMany(
          { name: { $in: skills } },
          { $push: { teachers: newTeacher } }
        );
      }
  
      verification.hasLogged = true;
      verification.userInfo = {};
  
      // pull requested fields from user info returned from db
      for (const key in specifiedFields) {
        verification.userInfo[key] = user[key];
      }
  
      // console.log("verifiction ", verification);
      res.locals.verification = verification;
  
      return next();
    } catch (err) {
      return next(err);
    }
  }
};

function validateEmail(str: string):boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(str).toLowerCase());
}

authController.createSession = async (req, res, next) => {
  try {
    if (res.locals.verification.hasLogged !== true) {
      return next();
    }

    const token = await jwt.sign({ id: req.body.email }, process.env.ID_SALT);
    res.cookie("ssid", token);
    return next();
  } catch (err) {
    next(err);
  }
};

authController.verifyToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    const isToken = await jwt.verify(token, process.env.ID_SALT);
    if (isToken.id) {
      res.locals.tokenVerif = true;

      // const queryFilter = {
      //   targetEmail: isToken.id,
      // };

      // const specifiedFields = {};

      // const updateFields = {
      //   $set: {
      //     isRead: true,
      //   },
      // };

      // const messages = await models.Message.find(queryFilter, specifiedFields);
      // await models.Message.updateMany(queryFilter, updateFields);

      // res.locals.messages = messages;
    } else res.locals.tokenVerif = false;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authController;
