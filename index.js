import express from "express";
import Connection from "./src/models/index.js";
import authRoute from "./src/routes/authRoute.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");

  // authenticate database connection
  Connection.authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  // sync User model with database
  Connection.sync();
});
