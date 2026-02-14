import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT

const server = async () => {
    try {
        await prisma.$connect();
        console.log("Successfully comnnected to databases");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

server();
