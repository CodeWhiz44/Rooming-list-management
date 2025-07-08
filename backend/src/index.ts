import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authenticateJWT } from "./middleware/auth.middleware";

import authRoutes from "./routes/auth.routes";
import roomingListRoutes from "./routes/roomingLists.routes";
import bookingsRoutes from "./routes/bookings.routes";
import seedRoutes from "./routes/seed.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use(authenticateJWT);

app.use("/api/rooming-lists", roomingListRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/seed", seedRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Backend listening at http://localhost:${PORT}`);
});

export default app;
