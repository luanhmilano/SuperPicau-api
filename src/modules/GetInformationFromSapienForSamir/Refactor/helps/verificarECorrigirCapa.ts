const { JSDOM } = require('jsdom');
import { IGetInformationsFromSapiensDTO } from "../../../../DTO/GetInformationsFromSapiensDTO";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
import { getCapaDoPassivaUseCase } from "../../../GetCapaDoPassiva";
import { verificarCapaTrue } from "../../helps/verificarCapaTrue";

export async function verificarECorrigirCapa(data: IGetInformationsFromSapiensDTO, cookie: string): Promise<any> {

    try {
        const capaParaVerificar = await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie);
        const capaFormatada = new JSDOM(capaParaVerificar);

        const infoClasseExist = await verificarCapaTrue(capaFormatada);
        if (!infoClasseExist) {
            // Tenta buscar uma nova capa com outro XPath
            try {
                const novaCapa = await buscarNovaCapaComOutroXPath(capaFormatada, cookie, data);
                return novaCapa;
            } catch (error) {
                console.error("Erro ao buscar nova capa:", error);
                throw new Error("Falha na verificação da capa. Verifique o processo.");
            }
        }

        return capaFormatada;
    } catch (error) {
        console.error("Erro ao verificar e corrigir a capa:", error);
        throw new Error("Falha na verificação da capa. Verifique o processo.");
    }
}

export async function buscarNovaCapaComOutroXPath(capaFormatada: any, cookie: string, data: IGetInformationsFromSapiensDTO): Promise<any> {

    const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b";
    const novaNup = await getXPathText(capaFormatada, xpathNovaNup);

    if (!novaNup) {
        throw new Error("Novo NUP não encontrado no XPath especificado.");
    }

    const nupFormatada = novaNup.split('(')[0].replace(/[./-]/g, "").trim();

    try {
        const capa = await getCapaDoPassivaUseCase.execute(nupFormatada, cookie);
        return new JSDOM(capa);
    } catch (error) {
        console.error("Erro ao buscar capa com novo NUP:", error);
        throw new Error("Erro ao buscar nova capa com NUP formatado.");
    }
}
