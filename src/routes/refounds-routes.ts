import { Router } from "express";

import { RefoundsController } from "@/controllers/refouns-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";


const refoundsRoutes = Router()
const refoundsController = new RefoundsController()

refoundsRoutes.post('/',verifyUserAuthorization(["employee"]), refoundsController.create)
refoundsRoutes.get('/',verifyUserAuthorization(["manager"]), refoundsController.index)
refoundsRoutes.get('/:id',verifyUserAuthorization(["employee","manager"]), refoundsController.show)

export { refoundsRoutes }
