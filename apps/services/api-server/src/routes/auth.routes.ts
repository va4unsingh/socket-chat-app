import { Router } from "express";
import { signIn, signUp, verifyUser } from "../controllers/users.controller";

const router: Router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:token").get(verifyUser);
router.route("/me").get();
router.route("/logout").post();

router.route("/refresh-token").post();
router.route("/forgot-password").post();
router.route("/reset-password/:token").post();
router.route("/change-password").post();

export default router;
