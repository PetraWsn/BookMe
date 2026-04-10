import * as authService from "../services/authServices.js";
import jwt from "jsonwebtoken";
import { getRedis } from "../config/redis.js";
import { generateAccessToken } from "../utils/tokenUtils.js";
import { logger } from "../config/logger.js";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    const { accessToken, refreshToken } = await authService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(
      `CONTROLLER: Ny användare registrerad och inloggad: ${user.email}`,
    );
    res.status(201).json({ user, accessToken });
  } catch (err) {
    // --- INBYGGT SÅRBARHET FÖR LEKTION 9 ---
    if (err.message.includes("finns redan")) {
      logger.warn(
        `SÄKERHETSINCIDENT: Registreringsförsök med duplicerad e-post: ${req.body.email}`,
      );

      // Vi tvingar webbläsaren att tolka svaret som HTML
      res.setHeader("Content-Type", "text/html");

      // Vi skickar tillbaka felmeddelandet (som innehåller användarens input) orenat
      return res.status(400).send(`
        <html>
          <body>
            <h1>Registreringsfel</h1>
            <p>Tyvärr, ${err.message}</p>
          </body>
        </html>
      `);
    }
    // ---------------------------------------
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(
      `CONTROLLER: Inloggning slutförd för ${user.email}. Cookie satt.`,
    );
    res.status(200).json({ user, accessToken });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      logger.warn(
        `CONTROLLER_AUTH: Misslyckad inloggning på e-post: ${req.body.email}`,
      );
      return res
        .status(401)
        .json({ message: "Felaktig e-postadress eller lösenord" });
    }
    next(err);
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    if (!tokenFromCookie) {
      logger.warn("CONTROLLER_AUTH: Refresh försök utan cookie.");
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
    const redis = getRedis();
    const storedToken = await redis.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== tokenFromCookie) {
      logger.error(
        `CONTROLLER_AUTH: Ogiltig/Svartlistad refresh token för "${user.name}" (ID: ${decoded.id})`,
      );
      return res.status(401).json({ message: "Invalid session" });
    }

    const user = await authService.getUserById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateAccessToken(user);
    logger.info(
      `CONTROLLER: Ny Access Token genererad för "${user.name}" (ID: ${user._id})`,
    );
    res.json({ accessToken });
  } catch (err) {
    logger.error(`CONTROLLER_AUTH: Refresh misslyckades - ${err.message}`);
    res.status(401).json({ message: "Session expired" });
  }
};

// ME
export const me = async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      const redis = getRedis();
      await redis.del(`refresh:${req.user.id}`);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const displayName = req.user?.name || "Användare";
    logger.info(
      `CONTROLLER: "${displayName}" utloggad. Redis och Cookie rensade.`,
    );

    res.json({ message: "Logged out" });
  } catch (err) {
    logger.error(`CONTROLLER_ERROR: Fel vid utloggning - ${err.message}`);

    res.json({ message: "Logged out with warnings" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    logger.info(
      `CONTROLLER: Profil uppdaterad för "${updatedUser.name}" (ID: ${req.user.id})`,
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (
      err.message === "E-postadressen används redan" ||
      err.message === "Användaren hittades inte"
    ) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res, next) => {
  try {
    const result = await authService.updatePassword(req.user.id, req.body);
    logger.info(
      `CONTROLLER: Lösenordsbyte lyckades för "${updatedUser.name}" (ID: ${req.user.id})`,
    );
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Nuvarande lösenord är felaktigt") {
      return res.status(401).json({ message: err.message });
    }
    next(err);
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res, next) => {
  try {
    const userName = req.user?.name || "Okänd användare";
    const userId = req.user.id;

    const result = await authService.deleteAccount(userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    logger.info(`CONTROLLER: Konto raderat för "${userName}" (ID: ${userId})`);

    res.status(200).json(result);
  } catch (err) {
    logger.error(
      `CONTROLLER_ERROR: Fel vid radering av konto - ${err.message}`,
    );
    next(err);
  }
};
