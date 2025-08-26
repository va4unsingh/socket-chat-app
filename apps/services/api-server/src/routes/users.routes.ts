import { Router } from "express";
import {
  refreshAccessToken,
  signIn,
  signUp,
  verifyUser,
} from "../controllers/users.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

// No auth needed
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:token").get(verifyUser);
router.route("/refresh-token").post(refreshAccessToken);
// router.route("/forgot-password").post();
// router.route("/reset-password/:token").post();

// // Auth needed
// router.route("/me").get(verifyJWT);
// router.route("/logout").post(verifyJWT);
// router.route("/change-password").post(verifyJWT);

export default router;
