import express from "express";
import apiRouter from "./routes/index.js";
import {
    errorHandler,
    notFoundHandler,
} from "./middleware/error-handler.js";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
        },
    });
});

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
