import express from "express";
import cors from "cors";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
    res.send("Welcome to Construction Site Reporting System!!");
})

export default app;

