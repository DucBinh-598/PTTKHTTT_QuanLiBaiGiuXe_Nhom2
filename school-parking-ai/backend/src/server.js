import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/database.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected.");

    app.listen(PORT, () => {
      console.log(`Backend running: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động Backend:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
