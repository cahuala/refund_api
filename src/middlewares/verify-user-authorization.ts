import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"

function verifyUserAuthorization(roles: string[]) {
  return function (request: Request, response: Response, next: NextFunction) {
    
    if (!request.user || !roles.includes(request.user.role)) {
      throw new AppError("Você não tem permissão para acessar este recurso", 403)
    }

    return next()
  }
}

export { verifyUserAuthorization }