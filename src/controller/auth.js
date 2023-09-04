import User from "../model/user";
import { signinSchema, singupSchema } from "../schemas/auth";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
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
    
    const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
      expiresIn: "10m",
    });

    const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
      expiresIn: "1d"
    })

    res.cookie("jwt", refreshToken, { 
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
      secure: true,
    });

    user.passWord = undefined;
    return res.status(200).json({
      accessToken,
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
    const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
      expiresIn: "10m",
    });

    const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
      expiresIn: "1d"
    })

    res.cookie("jwt", refreshToken, { 
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
      httpOnly: true,
      secure: true,
    });

    user.passWord = undefined;

    return res.status(200).json({
      accessToken,
      data: user,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.json({
        token: "",
      });
    }
    jwt.verify(refreshToken, process.env.SERECT_REFRESHTOKEN_KEY, (err, decode) => {
      if(err) {
        return res.status(406).json({
          token: '',
        })
      } else {
        const accessToken = jwt.sign({ id: decode.id }, process.env.SERECT_ACCESSTOKEN_KEY, {
          expiresIn: "10m"
        })
        return res.status(200).json({
          token: accessToken
        })
      }
    })
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