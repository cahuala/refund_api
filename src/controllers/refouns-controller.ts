import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import z from 'zod'

const CategoriesEnum = z.enum([
    'food', 
    'others', 
    'services',
    'transport',
    'accommodation',
    ])  

class RefoundsController {
    async create(request: Request, response: Response) {
        const bodySchema =z.object({
            description:z.string().trim().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
            category: CategoriesEnum,
            amount: z.number().positive({ message: "Valor deve ser positivo" }),
            filename: z.string().min(3, { message: "Nome do arquivo deve ter no mínimo 3 caracteres" }),
        })
        const { description, category, amount, filename } = bodySchema.parse(request.body)
        
        if(!request.user?.id){
            throw new AppError('Unauthorized', 401)
        }
        
        const refund = await prisma.refunds.create({
            data: {
                description,  
                category,
                amount,
                filename,
                userId: request.user.id
            }
        })
        response.status(201).json(refund)
        
    }

    async index(request: Request, response: Response) {
        const querySchema = z.object({
            name: z.string().optional(),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        const { name, page, perPage } = querySchema.parse(request.query)
        // Calcular os valores de skip
        const skip = (page - 1) * perPage
        const refunds = await prisma.refunds.findMany({
            skip,
            take: perPage,
            where:{
                user:{
                    name:{
                        contains: name?.trim()
                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                user:true
            }
        })
        // obter o total de registros para calcular o total de páginas
        const totalRecords = await prisma.refunds.count({
            where:{
                user:{
                    name:{
                        contains: name?.trim()
                    }
                }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            refunds,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = paramsSchema.parse(request.params)
        
        const refund = await prisma.refunds.findFirst({
            where:{
                id
            },
            include:{
                user:true
            }
        })
        if(!refund){
            throw new AppError('Refund not found', 404)
        }
        response.json(refund)
    }
}

export { RefoundsController }