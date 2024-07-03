import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";
import { parseDate } from "./parseDate";
import { isDateInRange } from "./dataIsInRange";
import { getRemuneracaoAjuizamentoNormal } from "./getRemuneracaoAjuizamentoNormal";
import { removeDayFromDate } from "./removeDayFromDate";
import { parseDateToString } from "./parseDateToString";
const { JSDOM } = require('jsdom');

export async function getValueCalcDossieNormal (cookie:string, dossieNormal: any, dataAjuizamento: string, dataRequerimento: string) {
    try {

        const idDosprevParaPesquisaDossieNormal = dossieNormal.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });
        
        const paginaDosPrevFormatadaDossieNormal = new JSDOM(paginaDosPrevDossieNormal); 


        // RELAÇÕES PREVIDENCIÁRIAS
        
        try {
            // /html/body/div/div[4]/table/tbody/tr[2]
            let tamanhoColunasRelacoes = 2;
            let verificarWhileRelacoes = true;
            while(verificarWhileRelacoes) {
                if(typeof (getXPathText(paginaDosPrevFormatadaDossieNormal, `/html/body/div/div[4]/table/tbody/tr[${tamanhoColunasRelacoes}]`)) == 'object'){
                    verificarWhileRelacoes = false; 
                    break;
                }
                tamanhoColunasRelacoes++;
            }

            const relacoesEncontradas = []
            const regexSeq = /\b\d{1,2}\b/g;
            const regexData: RegExp = /\b(?:\d{1,2}\/)?\d{1,2}\/\d{4}\b/g;

            for(let t = 2; t < tamanhoColunasRelacoes; t++) {
                if(typeof (getXPathText(paginaDosPrevFormatadaDossieNormal,`/html/body/div/div[4]/table/tbody/tr[${t}]`)) === 'string') {
                    const xpathColunaRelacoes = `/html/body/div/div[4]/table/tbody/tr[${t}]`
                    const xpathCoulaFormatadoRelacoes: string = getXPathText(paginaDosPrevFormatadaDossieNormal, xpathColunaRelacoes)
                    const isBeneficio = xpathCoulaFormatadoRelacoes.indexOf('Benefício') !== -1
                    if(!isBeneficio) {
                        const identificarSeq = xpathCoulaFormatadoRelacoes.match(regexSeq)
                        const getDatas: string[] | null = xpathCoulaFormatadoRelacoes.match(regexData);


                        if (!getDatas) {

                            return new Error('NÃO FOI POSSÍVEL COLETAR AS DATAS NO DOSPREV')
                            
                        } else {

                            const dates = getDatas.map(dateString => parseDate(dateString))
        
                            const relacao = {
                                seq: identificarSeq[0],
                                dataInicio: dates[0],
                                dataFim: dates[1] || null,
                                originalString: xpathCoulaFormatadoRelacoes
                            }

                            if (relacao.dataFim !== null) {
                                relacoesEncontradas.push(relacao)
                            }
        

                        }
                        
                        
                    } 
                }
            }



            // VERIFICAR SE A DATA MAIS ATUAL É UM VÍNCULO DE SERVIÇO PÚBLICO
            let mostRecentDataFim = null;
            let containsPRPPS = false;
            let mostRecentSeq = null;
            let mostRecentDataString;
            let mostRecentDataFormatada; 

            relacoesEncontradas.forEach(relacao => {
                if (relacao.dataFim) {
                    if (!mostRecentDataFim || relacao.dataFim > mostRecentDataFim.dataFim) {
                        mostRecentDataFim = relacao
                        containsPRPPS = relacao.originalString.includes('PRPPS')
                        mostRecentSeq = relacao.seq;
                    }
                }
            })

            if (mostRecentDataFim) {
                console.log('Most recent dataFim:', mostRecentDataFim.dataFim);
                console.log('Contains PRPPS:', containsPRPPS);
                console.log('SEQ of the most recent dataFim:', mostRecentSeq);

                mostRecentDataString = parseDateToString(mostRecentDataFim.dataFim)
                mostRecentDataFormatada = removeDayFromDate(mostRecentDataString)

                console.log(mostRecentDataFormatada)

            } else {
                console.log('No dataFim found.');
            }



            // ENCONTRAR A RELAÇÃO PREVIDENCIARIA QUE POSSUI O INTERVALO

            const dateAjuizamento = parseDate(dataAjuizamento)
            const dateRequerimento = parseDate(dataRequerimento)

            const ajzFormatado = removeDayFromDate(dataAjuizamento)
            const reqFormatado = removeDayFromDate(dataRequerimento)

            const seqIntervaloAjuizamento = isDateInRange(relacoesEncontradas, dateAjuizamento)
            const seqIntervaloRequerimento = isDateInRange(relacoesEncontradas, dateRequerimento)

            console.log('---SEQ INTERVALO AJUIZAMENTO')
            console.log(seqIntervaloAjuizamento)

            console.log('---SEQ INTERVALO REQUERIMENTO')
            console.log(seqIntervaloRequerimento)


            if (seqIntervaloAjuizamento && seqIntervaloRequerimento) {
                // ACHANDO AS RELAÇÕES PARA AS DUAS DATAS, É POSSÍVEL COLETAR AS REMUNERAÇÕES
                
                const remuneracaoAjuizamento = await getRemuneracaoAjuizamentoNormal(seqIntervaloAjuizamento, paginaDosPrevFormatadaDossieNormal, ajzFormatado)

                const remuneracaoRequerimento = await getRemuneracaoAjuizamentoNormal(seqIntervaloRequerimento, paginaDosPrevFormatadaDossieNormal, reqFormatado)

                console.log('--REMUNERACAO AJUIZAMENTO')
                console.log(remuneracaoAjuizamento)

                console.log('--REMUNERACAO REQUERIMENTO')
                console.log(remuneracaoRequerimento)

                return {
                    remuneracaoAjz: remuneracaoAjuizamento,
                    remuneracaoReq: remuneracaoRequerimento
                }

            } else if (seqIntervaloAjuizamento && !seqIntervaloRequerimento) {

                const remuneracaoAjuizamento = await getRemuneracaoAjuizamentoNormal(seqIntervaloAjuizamento, paginaDosPrevFormatadaDossieNormal, ajzFormatado)

                let remuneracaoRequerimentoServidor = 0;
                if (mostRecentDataFim && containsPRPPS) {
                    remuneracaoRequerimentoServidor = await getRemuneracaoAjuizamentoNormal(mostRecentSeq, paginaDosPrevFormatadaDossieNormal, mostRecentDataFormatada)
                }

                return {
                    remuneracaoAjz: remuneracaoAjuizamento,
                    remuneracaoReq: remuneracaoRequerimentoServidor
                }

            } else if (!seqIntervaloAjuizamento && seqIntervaloRequerimento) {

                const remuneracaoRequerimento = await getRemuneracaoAjuizamentoNormal(seqIntervaloRequerimento, paginaDosPrevFormatadaDossieNormal, reqFormatado)


                let remuneracaoAjuizamentoServidor = 0;
                if (mostRecentDataFim && containsPRPPS) {
                    remuneracaoAjuizamentoServidor = await getRemuneracaoAjuizamentoNormal(mostRecentSeq, paginaDosPrevFormatadaDossieNormal, mostRecentDataFormatada)
                }

                return {
                    remuneracaoAjz: remuneracaoAjuizamentoServidor,
                    remuneracaoReq: remuneracaoRequerimento
                }
            } else {
                return {
                    remuneracaoAjz: 0,
                    remuneracaoReq: 0
                }
            }


        } catch (error) {
            console.error(error)
        }


        // RETORNAR UM OBJETO COM REMUNERAÇÃO DE AJUIZAMENTO E REMUNERAÇÃO DE REQUERIMENTO



    } catch (error) {
        console.error(error)
    }
}