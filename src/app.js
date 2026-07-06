const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { authRouter } = require("./router/auth");
const { profileRouter } = require("./router/profile");
const { requestRouter } = require("./router/request");
const { userRouter } = require("./router/user");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connection succesfull");
    app.listen(3000, () => {
      console.log("Server is succesfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed");
  });
