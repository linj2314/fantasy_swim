import express from "express";
import cors from "cors";
import users from "./routes/user.js";
import leagues from "./routes/league.js";
import cron from "node-cron";
import UpdateDB from "./db/UpdateDB.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", users);
app.use("/league", leagues);

cron.schedule("0 0 * * *", () => {
  UpdateDB();
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});