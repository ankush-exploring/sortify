import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.dropDatabase();
  console.log("Database dropped — all users, tickets, verification codes cleared.");
  process.exit(0);
}
reset();
