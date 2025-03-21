import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionRoutes } from "./sessions-routes";
import { refoundsRoutes } from "./refounds-routes";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { uploadsRoutes } from "./uploads-routes";
const routes = Router()

// Rotas publicas
routes.use('/users', usersRoutes)
routes.use("/sessions",sessionRoutes)

// Rotas privadas
routes.use(ensureAuthenticated)
routes.use("/refounds", refoundsRoutes)
routes.use("/uploads", uploadsRoutes)

export { routes }