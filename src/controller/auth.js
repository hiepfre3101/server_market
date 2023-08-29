import User from "../model/user";
import { signinSchema, singupSchema } from "../schemas/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
  try {
    const { error } = singupSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(({ message }) => message);
      return res.status(401).json({
        error: errors,
      });
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(202).json({
        error: "Email already registered",
      });
    }
    
    const hashPassword = await bcrypt.hash(req.body.passWord, 10)

    const user = await User.create({
      ...req.body,
      passWord: hashPassword,
    });
    if (!user) {
      return res.status(401).json({
        error: "Create a new user failed",
      });
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.SERECT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, { 
      expire: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
      secure: true,
    });

    user.passWord = undefined;
    return res.status(200).json({
      accessToken: token,
      data: user,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(({ message }) => message);
      return res.status(401).json({
        error: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(202).json({
        error: "Email not exist",
      });
    }

    if(!user.state) {
      return res.status(403).json({
        error: "This account is disabled"
      })
    }

    const validPass = await bcrypt.compare(
      req.body.passWord,
      user.passWord
    );
    if (!validPass) {
      return res.status(202).json({
        error: "Passwords do not match",
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "Create a new user failed",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SERECT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, { 
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
      secure: true,
    });

    user.passWord = undefined;

    return res.status(200).json({
      accessToken: token,
      data: user,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const getToken = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({
        token: "",
      });
    }
    return res.json({
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const clearToken = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({
        message: "no token available",
      });
    }

    res.clearCookie("jwt");

    return res.json({
      message: "token have been removed",
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};