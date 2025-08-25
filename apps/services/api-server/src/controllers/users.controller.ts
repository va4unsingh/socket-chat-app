import { Request, Response } from "express";
import mongoose from "mongoose";
import { loginSchema, registerSchema } from "../schema/user.schema";
import { User } from "../models/users.model";
import nodemailer from "nodemailer";

const signUp = async (req: Request, res: Response) => {
  try {
    const parsedBody = registerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { firstname, lastname, username, email, password } = parsedBody.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({
        message: "username already taken",
        success: false,
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        success: false,
      });
    }

    const verificationToken = user.generateVerificationToken();
    await user.save();

    try {
      // send mail to user for verification
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST as string,
        port: parseInt(process.env.MAILTRAP_PORT as string),
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USERNAME as string,
          pass: process.env.MAILTRAP_PASSWORD as string,
        },
      });

      const mailOption = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: user.email,
        subject: "Click here to verify your email",
        text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`,
      };

      await transporter.sendMail(mailOption);
      console.log(`Verification email sent to: ${user.email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account",
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({
      message: "Internal server error while registering user",
      success: false,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const parsedBody = loginSchema.safeParse(req.body);
    if(!parsedBody.success){
        retr
    }
  } catch (error) {}
};
