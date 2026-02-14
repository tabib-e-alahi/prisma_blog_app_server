import app from "./app";
import { prisma } from "./lib/prisma";

const server = async () => {
    try {
        await prisma.$connect();
        console.log("Successfully comnnected to databases");
        app.listen(5000, () => {
            console.log(`Server is running on port ${5000}`);
        });
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

server();
