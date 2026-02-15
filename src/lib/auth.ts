import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: true,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
    trustedOrigins: [process.env.FRONEND_URL!],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.FRONEND_URL}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Tabib Prisma Blog APp" <prisma4590@prisma.email>',
                    to: user.email,
                    subject: "Please verify your email.",
                    html: `
                  <!doctype html>
                  <html>
                  <head>
                        <meta charset="UTF-8" />
                        <title>Email Verification</title>
                  </head>
                  <body
                        style="
                              font-family: Arial, sans-serif;
                              background-color: #f4f6f8;
                              padding: 20px;
                        "
                  >
                        <div
                              style="
                              max-width: 600px;
                              margin: auto;
                              background: #ffffff;
                              padding: 30px;
                              border-radius: 8px;
                              "
                        >
                              <h2 style="color: #333">Verify Your Email Address</h2>

                              <p style="color: #555">Hello ${user.name || "User"},</p>

                              <p style="color: #555">
                              Thank you for signing up for <strong>Prisma Blog</strong>.
                              Please click the button below to verify your email address.
                              </p>

                              <div style="text-align: center; margin: 30px 0">
                              <a
                                    href="${verificationUrl}"
                                    style="
                                          background-color: #4f46e5;
                                          color: white;
                                          padding: 12px 25px;
                                          text-decoration: none;
                                          border-radius: 6px;
                                          font-size: 16px;
                                    "
                              >
                                    Verify Email
                              </a>
                              </div>

                              <p style="color: #777; font-size: 14px">
                              If you didn’t create an account, you can safely ignore this
                              email.
                              </p>

                              <hr style="margin: 20px 0" />

                              <p style="color: #999; font-size: 12px; text-align: center">
                              © ${new Date().getFullYear()} Prisma Blog Tabib. All rights reserved.
                              </p>
                        </div>
                  </body>
                  </html>`,
                });

                console.log(info);
            } catch (error: any) {
                console.error(error);
                throw new Error(error.message);
            }
        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
