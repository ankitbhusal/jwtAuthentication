import { Router } from "express";

import AuthController from "../controllers/authController.js";
import AuthMiddleware from "../middlewares/middleware.js";

const authMiddleware = new AuthMiddleware();

const router = Router();

const authController = new AuthController();

// validation for auth inputs middleware
router.use("/add", (req, res, next) => {
  authMiddleware.validateAuthInput(req, res, next);
});

// after validation post to database
router.post("/add", (req, res) => {
  authController.addUser(req, res);
});

// login route for auth
router.post("/login", (req, res, next) => {
  // check the validation of user here
  authController.checkLogin(req, res, next);
});

router.post("/login", (req, res) => {
  console.log("\n\n After login middlewares\n\n");
  console.log(req.body);
});

router.post("/home", authMiddleware.verifyToken, (req, res) => {
  console.log("Home route after middleware");
  return res.json({
    message: "Welcome to home page",
  });
});

export default router;
