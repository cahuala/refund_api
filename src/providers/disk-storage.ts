import fs from "node:fs"
import path from "node:path"
import uploadConfig from '@/configs/upload'

class DiskStorage{
    async saveFile(file: string){
        const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)
        const destinationPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

        try{
            await fs.promises.access(tmpPath)
        }catch(error){
            console.log(error)
            throw new Error(`Erro ao salvar arquivo:${tmpPath}`)
        }

        await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true })
        await fs.promises.rename(tmpPath, destinationPath)

        return file
    }

    async deleteFile(file: string, type:"tmp" | "uploads"){
        const filePath = type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

        const fullPath = path.resolve(filePath, file)

        try{
            await fs.promises.stat(fullPath)
        }catch{
            return
        }

        await fs.promises.unlink(fullPath)
    }
}

export { DiskStorage }