import { Request, Response } from 'express';
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';
import { BuscarImpedimentosUseCase } from '../BuscarImpedimentos/BuscarImpedimentosUseCase';
import { finalizarTriagem } from './utils/finalizarTriagem';
import { IResponseLabraAutorConjuge } from '../../../DTO/IResponseSislabra';
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM } from '../../../DTO/IObjInfoImpeditivosRM';
import { GetInformationsFromSapiensDTO } from '.';


export class GetInformationFromSapiensForPicaPauControllerRefactor {

    constructor(
        private getInformationFromSapiensForPicaPauUseCaseRefactor: GetInformationFromSapiensForPicaPauUseCaseRefactor,
        private buscarImpedimentosUseCase: BuscarImpedimentosUseCase
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetInformationsFromSapiensDTO = request.body;
        console.log("CALL HERE REFACTOR")
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                try {
                    const result = await this.getInformationFromSapiensForPicaPauUseCaseRefactor.execute(data);

                    if ('warning' in result) {
                        return resolve(response.status(200).json(result))
                    }

                    let impedimentos: string[];

                    let impedimentosLabraRM: IResponseLabraAutorConjuge;
                    let impedimentosLabraLoas: any;

                    let impedimentosDosprevRM: IObjInfoImpeditivosRM;
                    let impedimentosDosprevLoas: IObjInfoImpeditivosLoas;

                    if (result[1] === 'LOAS') {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosLOAS(result[0]);
                        impedimentos = buscaDeImpedimentos.impedimentos;
                    } else {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentos(result[0])
                        impedimentos = buscaDeImpedimentos.impedimentos;
                        impedimentosLabraRM = buscaDeImpedimentos.objImpedimentosLabra;
                        impedimentosDosprevRM = buscaDeImpedimentos.objImpedimentos;
                    }

                    const processo = await finalizarTriagem(
                        impedimentos,
                        impedimentosLabraRM, 
                        impedimentosLabraLoas, 
                        impedimentosDosprevRM, 
                        impedimentosDosprevLoas, 
                        result[0]);

                    resolve(response.status(200).json(processo));

                } catch (error) {
                    console.error("Farfan", error)
                    return response.status(400).json({
                        message: error.message || "Erro inesperado durante a triagem."
                    });
                }
            }, 5000)
        })
    }
}
