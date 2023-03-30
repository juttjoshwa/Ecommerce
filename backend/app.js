import express  from "express";
import products from "../backend/routes/productRoute.js"
import ErrorMiddleware1 from "./middleware/error.js"
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoutes.js";
import Order from "./routes/orderRoute.js";
import bodyParser from "body-parser";
import cors from "cors"


const app = express()
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser())
//routes
app.use(express.json());
app.use(cors())

app.use("/api/v1",products);

// middleware for Error
app.use(ErrorMiddleware1);

// routes for refister
app.use("/api/v1",UserRoute);

// route for orders
app.use("/api/v1",Order);
export default app;