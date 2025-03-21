import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from "zod"
import uploadConfig from "@/configs/upload" 
import { DiskStorage } from '@/providers/disk-storage'
import { AppError } from '@/utils/AppError'
class UploadsController {
  async create(request: Request, response: Response, next: NextFunction) {
   const diskStorage = new DiskStorage()
    try {
        const fileSchema = z.object({
                filename: z.string().min(2,"Nome do arquivo deve ter no mínimo 2 caracteres" ),
                mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),`Arquivo deve ser uma imagem. Tipos aceitos: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`),
                size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, `Arquivo excede o tamanho máximo permitido de ${uploadConfig.MAX_SIZE}MB`)
        }).passthrough()

        const  file  = fileSchema.parse(request.file)
        const filename = await diskStorage.saveFile(file.filename)
        
        response.status(201).json({ filename })
    } catch (error) {
        if(error instanceof ZodError){
            if(request.file){
              await diskStorage.deleteFile(request.file.filename, "tmp")
            }
            
            throw new AppError(error.issues[0].message)
        }
        throw error
    }
    
}
}
export { UploadsController }