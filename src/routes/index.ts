import { Request, Response, Router } from "express";
import { authRouter } from "@/routes/auth.route";
import { pingDatabase } from "@/config/database"

export const registerRoutes = (app: Router) => {
    const v1_router = Router();

    // Health check
    v1_router.get("/health", healthCheck);

    // Auth routes
    v1_router.use("/auth", authRouter);

    app.use("/api/v1", v1_router);
};


const healthCheck = async (req: Request, res: Response) => {
    try {
        await pingDatabase()
        res.status(200).json({
            status: "OK"
        })
    } catch (err) {
        res.status(500).json({
            status: "Faulty",
            error: (err as Error).message
        })
    }
}
