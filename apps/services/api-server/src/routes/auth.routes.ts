import { Router } from "express";
import { changeCurrentPassword, deactivateAccount, deleteAccount, forgotPassword, getCurrentUser, logout, logoutAll, reactivateAccount, refreshAccessToken, resendVerificationEmail, resetPassword, signIn, signUp, updateAccountDetails, verifyUser } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router: Router = Router();

// No auth needed
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:token").get(verifyUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/resend-verification").post(resendVerificationEmail);
router.route("/reactivate-account").patch(reactivateAccount);

// Auth needed
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/logout-all").post(verifyJWT, logoutAll);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/deactivate-account").patch(verifyJWT, deactivateAccount);

export default router;
