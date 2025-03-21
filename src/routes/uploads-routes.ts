import { Router } from "express"
import multer from "multer"

import uploadConfig from "@/configs/upload"
import { UploadsController } from "@/controllers/uploads-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"


const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(verifyUserAuthorization(['employee']))
uploadsRoutes.post("/",upload.single("file"), uploadsController.create)

export { uploadsRoutes }