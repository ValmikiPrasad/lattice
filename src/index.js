import dotenv from "dotenv";
import { app } from "./app.js";
import db from "./db/index.js";
dotenv.config({ path: "./env" });

app.listen(process.env.PORT || 8000, () => {
  console.log(`server is running at ${process.env.PORT}`);
});
