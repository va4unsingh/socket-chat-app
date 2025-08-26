import { Router } from "express";
import { signIn, signUp, verifyUser } from "../controllers/users.controller";

const router: Router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:token").get(verifyUser);

export default router;
