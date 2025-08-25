import { Router } from "express";
import { signIn, signUp } from "../controllers/users.controller";

const router: Router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
// router.route("/register").post();

export default router;
