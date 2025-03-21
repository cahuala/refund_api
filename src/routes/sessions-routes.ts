import { SessionsController } from "@/controllers/sessions-controller"
import { Router } from "express"

const sessionRoutes = Router()
const sessionsController = new SessionsController()

sessionRoutes.post("/",sessionsController.create)


export { sessionRoutes }