import { generateToken } from "../utils/jwt.js";
import { UserModel } from "../models/User.js";

export const getSessions = async (req, res) => {
  try {
    res.json({ message: "Sessions (pendiente de implementar)" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
};

export const registerResponse = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "Usuario registrado correctamente",
    payload: {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const loginResponse = (req, res) => {
  const tokenUser = {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  };

  const token = generateToken(tokenUser);

  res.cookie("currentUser", token, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Login correcto",
  });
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser");
  res.status(200).json({
    status: "success",
    message: "Sesión cerrada",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      status: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios",
    });
  }
};
