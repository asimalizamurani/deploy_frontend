import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import {redis} from "../lib/redis.js"


const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token: ${userId}`, refreshToken, "EX",7*24*60*60); // 7days
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attacks, cross-site request forgery
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attacks, cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

const signup = async (req, res) => {
  const {name, email, password} = req.body
  try {
    const userExists = await User.findOne({ email })
  
    if(userExists) {
      return res.status(400).json({message: "User already exists"  })
    }
  
    const user = await User.create({ name, email, password})

    // authenticate
    const {accessToken, refreshToken} = generateTokens(user._id)
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);
  
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // message: "User created successfully"
      })
  } catch (error) {
    console.log("Error in sign up controller", error.message)
    res.status(500).json({message: error.message})
  }
}

const login = async (req, res) => {
  try {
    console.log("Login request received");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("User found:", user);  // Check if user is found

    if (user) {
      console.log("Stored password (hashed):", user.password);
      console.log("Input password:", password);
      const isMatch = await user.comparePassword(password);
      console.log("Password match:", isMatch);  // Check if password comparison works

      if (isMatch) {
        const { accessToken, refreshToken } = generateTokens(user._id);
        console.log("User authenticated");

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }
    }

    console.log("User not authenticated, invalid email or password");
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token: ${decoded.userId}`)
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message});
  }
}

const refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if(!refreshToken) {
        return res.status(401).json({ message: "No Refresh Token Provided" });
      }
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);

      if(storedToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.json({ message: "Token Refreshed Successfully" })
    } catch (error) {
      console.log("Error in refreshToken controller", error.message); // debugging
      res.status(500).json({ message: "Server error", error: error.message})
    }
}

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
}