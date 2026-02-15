import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

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
    },
});
