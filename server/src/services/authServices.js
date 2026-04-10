import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";
import { getRedis } from "../config/redis.js";
import { logger } from "../config/logger.js";
import Booking from "../models/bookingModel.js";

//** REGISTRERING **//
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`REGISTRERINGS_FÖRSÖK: E-post är redan registrerad.`);
    // HÄR BYGGER VI IN SÅRBARHETEN: Vi skickar med inmatningen i felet
    throw new Error(`Användaren med e-post ${email} finns redan!`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  logger.info(`NY ANVÄNDARE: Registrerat ett konto.`);
  return { id: user._id, name: user.name, email: user.email };
};

//** INLOGGNING **//
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.warn(`LOGIN_MISSLYCKAT: Felaktiga uppgifter för e-post: ${email}`);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const redis = getRedis();
  await redis.set(`refresh:${user._id}`, refreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  logger.info(`LOGIN_LYCKAT: "${user.name}" (${user.role}) loggade in.`);

  return {
    user: { id: user._id, email: user.email, role: user.role, name: user.name },
    accessToken,
    refreshToken,
  };
};

//** UPPDATERA PROFIL **//
export const updateProfile = async (userId, { name, email }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Användaren hittades inte");

  const oldEmail = user.email;
  if (name) user.name = name;
  if (email && email !== oldEmail) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) throw new Error("E-postadressen används redan");
    user.email = email;
    logger.info(
      `E-POST_ÄNDRAD: "${user.name}" bytte från ${oldEmail} till ${email}`,
    );
  }

  const updatedUser = await user.save();
  logger.info(
    `PROFIL_UPPDATERAD: "${updatedUser.name}" (ID: ${userId}) uppdaterade sin information.`,
  );
  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };
};

// ÄNDRA LÖSENORD
export const updatePassword = async (userId, { current, new: newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Användaren hittades inte");

  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) {
    logger.warn(
      `LÖSENORDS_FEL: Felaktigt nuvarande lösenord för användare: ${user.name}`,
    );
    throw new Error("Nuvarande lösenord är felaktigt");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  logger.info(
    `LÖSENORD_BYTT: Användare "${user.name}" har uppdaterat sitt lösenord.`,
  );
  return { message: "Lösenordet har uppdaterats" };
};

// RADERA KONTO
export const deleteAccount = async (userId) => {
  await Booking.deleteMany({ userId: userId });
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("Användaren hittades inte");

  const redis = getRedis();
  await redis.del(`refresh:${userId}`);

  logger.info(
    `KONTO_RADERAT: Användare med ID: ${userId} raderade sitt konto och rensade sin refresh token.`,
  );
  return { message: "Kontot har raderats permanent" };
};

export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};
