import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
class UserController{
    async create(request: Request, response: Response, next: NextFunction){
       
        const bodySchema = z.object({
            name: z.string().trim().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
            email: z.string().email({ message: "Email inválido" }).toLowerCase(),
            password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
            role: z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee)
       })
       const { name, email, password, role } = bodySchema.parse(request.body)
       
       const userWithSameEmail = await prisma.user.findFirst({ where: { email } })
        
       if(userWithSameEmail){
            throw new AppError("Já existe um usuário cadastrado com esse e-mail")
        }
       
        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                role
            }
        })
        const { password: _, ...userWithoutPassword } = user
        response.status(201).json(userWithoutPassword)
    }
}

export { UserController }