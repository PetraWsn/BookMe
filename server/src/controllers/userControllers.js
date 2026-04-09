import * as userService from "../services/userServices.js";
import { logger } from "../config/logger.js"; // Se till att importen stämmer

// GET /users
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.user);
    logger.info(`CONTROLLER: Skickar lista med ${users.length} användare.`);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/:id
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(
      userId,
      req.body,
      req.user,
    );
    logger.info(`CONTROLLER: Uppdatering av användare ${userId} slutförd.`);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id, req.user);

    logger.info(`CONTROLLER: Radering av användare ${id} slutförd.`);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
