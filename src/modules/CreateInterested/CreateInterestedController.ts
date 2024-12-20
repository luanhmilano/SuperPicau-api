import { Request, Response } from "express";
import { CreateInterestedUseCase } from "./CreateInterestedUseCase";
import { IinteressadosDTO } from "./dtos/InteressadosDTO";

export class CreateInterestedController{
    constructor(private readonly createInterestedUseCase: CreateInterestedUseCase) {}


    async handle(req: Request, resp: Response){
        const data: IinteressadosDTO = req.body

        try{
            const created = await this.createInterestedUseCase.execute(data);
            console.log(created)

            resp.status(200).json(created);
        }catch(error){
            return resp.status(400).json({
                message: error.message || "Unexpected error"
            });


        }
    }
}
