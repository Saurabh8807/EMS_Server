import express from "express";
import cookieParser from "cookie-parser";
import routes from "./src/routes/index.routes.js"
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Your client origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies to be sent
  }));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

app.use("/api/v1",routes)

export { app };


