import express  from "express";
import products from "../backend/routes/productRoute.js"
import ErrorMiddleware1 from "./middleware/error.js"
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoutes.js";


const app = express()
app.use(cookieParser())
//routes
app.use(express.json());

app.use("/api/v1",products);

// middleware for Error
app.use(ErrorMiddleware1);

// routes for refister
app.use("/api/v1/",UserRoute);

export default app;