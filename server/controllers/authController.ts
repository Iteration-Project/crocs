import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import User from "../models/userModel"
import Skill from "../models/skillModel"
import type { Request, Response, NextFunction } from "express"

interface AuthController {
  verifyUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<ReturnType<NextFunction>>
  createUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<ReturnType<NextFunction>>
  createSession: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<ReturnType<NextFunction>>
  verifyToken: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<ReturnType<NextFunction>>
}

type Verification = {
  hasLogged: boolean | string
  userInfo?: Record<string, any>
}

const authController: AuthController = {
  async verifyUser(req, res, next) {
    try {
      // console.log("verifyUser START");
      const { email, password } = req.body
      if (!email || !password) {
        res.locals.verification = {
          hasLogged: false,
        }
        return next()
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
      }

      const verification: Verification = {
        hasLogged: false,
      }

      const user = await User.findOne({ email })

      const verifiedUser = await user.verify(password)
      // console.log("verifiedUser ", verifiedUser);

      if (!user || !verifiedUser) {
        verification.hasLogged = false
        res.locals.verification = verification
        return next()
      } else if (user && verifiedUser) {
        verification.hasLogged = true
        verification.userInfo = {}
        for (const key in specifiedFields) {
          verification.userInfo[key] = user[key]
        }

        // if (user.newMessages) {
        //   await User.updateOne({ email }, { $set: { newMessages: false } });
        // }

        res.locals.verification = verification
        // console.log("verification ", res.locals.verification);
        return next()
      }
      // console.log("verifyUser END");
    } catch (err) {
      return next(err)
    }
  },
  async createUser(req, res, next) {
    try {
      // console.log("createUser START");
      const { email, password, firstName, lastName, skillsToTeach } = req.body
      const verification: Verification = {
        hasLogged: false,
      }

      if (!email || !password || !firstName || !lastName) {
        // console.log("Missing information");
        res.locals.verification = {
          hasLogged: "empty",
        }
        return next()
      }
      if (!validateEmail(email)) {
        // console.log("Cannot validate email");
        verification.hasLogged = "format"
        res.locals.verification = verification
        return next()
      }

      const teach = []
      for (const key in skillsToTeach) {
        teach.push({
          name: key,
          _id: new mongoose.Types.ObjectId(skillsToTeach[key]),
        })
      }

      // object specifying the filters on query
      const userDoc = {
        email,
        password,
        firstName,
        lastName,
        teach,
      }

      // object specifying the fields to be returned from db
      const specifiedFields = {
        name: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        isAdmin: 1,
        newMessages: 1,
      }

      const emailExist = await User.findOne({ email })

      if (emailExist) {
        res.locals.verification = verification
        return next()
      }

      const user = await User.create(userDoc)

      // update teachers in skill to reflect the new user
      const newTeacher = {
        firstName,
        lastName,
        email,
        _id: user._id,
      }

      const skills = Object.keys(skillsToTeach)
      if (skills.length != 0) {
        await Skill.updateMany(
          { name: { $in: skills } },
          { $push: { teachers: newTeacher } },
        )
      }

      verification.hasLogged = true
      verification.userInfo = {}

      // pull requested fields from user info returned from db
      for (const key in specifiedFields) {
        verification.userInfo[key] = user[key]
      }

      res.locals.verification = verification

      return next()
    } catch (err) {
      return next(err)
    }
  },
  async createSession(req, res, next) {
    try {
      if (res.locals.verification.hasLogged !== true) {
        return next()
      }

      const token = await jwt.sign({ id: req.body.email }, process.env.ID_SALT)
      res.cookie("ssid", token)
      return next()
    } catch (err) {
      next(err)
    }
  },
  async verifyToken(req, res, next) {
    try {
      const token = req.body.token
      const isToken = await jwt.verify(token, process.env.ID_SALT)
      if (isToken.id) {
        res.locals.tokenVerif = true
      } else res.locals.tokenVerif = false
      return next()
    } catch (err) {
      return next(err)
    }
  },
}

function validateEmail(str: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(str).toLowerCase())
}

export default authController;
