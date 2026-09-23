import { generateToken } from "../utils/jwt.js";
import { getAllUsersService } from '../services/sessions.service.js'
import { CurrentUserDTO } from '../dto/current-user.dto.js'

export const getSessions = async (req, res) => {
  try {
    res.json({ message: "Sessions (pendiente de implementar)" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
};

export const registerResponse = (req, res) => {
  const userDTO = new CurrentUserDTO(req.user)
  res.status(201).json({
    status: "success",
    message: "Usuario registrado correctamente",
    payload: userDTO,
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
    const userDTO = new CurrentUserDTO(req.user)
    res.status(200).json({ status: 'success', payload: userDTO })
}

export const logout = (req, res) => {
  res.clearCookie("currentUser");
  res.status(200).json({
    status: "success",
    message: "Sesión cerrada",
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService()
    const usersDTO = users.map(user => new CurrentUserDTO(user))
    res.status(200).json({
      status: "success",
      payload: usersDTO,
    });
  } catch (error) {
    next(error); 
  }
};



