import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import z from 'zod'

class SessionsController{
   async create(request:Request,response:Response){
        const bodySchema = z.object({
            email: z.string().email(),
            password:z.string().min(8)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            throw new AppError("Email ou senha invalido", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError("Email ou senha invalido", 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role ?? "employee" }, secret, {
            subject: user.id,
            expiresIn
        })

        const { password: hashedPassword, ...userWithoutPassword } = user

         response.json({ token, user: userWithoutPassword })
    }
}

export { SessionsController }