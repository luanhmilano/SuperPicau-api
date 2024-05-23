const { JSDOM } = require('jsdom');

import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";

export async function verificarDossieMaisAtual(cpf: string, cookie:string ,normalDossie?: any[], superDossie?: any[]){

    

if(normalDossie && !superDossie){
    for(let i = 0; i < normalDossie.length; i++){
        let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
        if(objetoDosprev){
            return new Error("DOSPREV COM FALHA NA PESQUISA")
        }

        const idDosprevParaPesquisa = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
        const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

        const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 

        const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
        const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);

        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

        if(cpf.trim() == cpfDosprev.trim()){
            console.log("retornou")
            return [normalDossie[i], 0]
        }    
    }
}



if(!normalDossie && superDossie){
    for(let i = 0; i < superDossie.length; i++){
        let objetoDosprev =  (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 

        if(objetoDosprev){
            return new Error("DOSPREV COM FALHA NA PESQUISA")
        }

        const idDosprevParaPesquisa = superDossie[i].documentoJuntado.componentesDigitais[0].id;
        const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

        const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 

        const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
        const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);

        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

        if(cpf.trim() == cpfDosprev.trim()){
            return [superDossie[i], 1]
        }    
    }
}

if(normalDossie && superDossie){

    if(normalDossie.length >= superDossie.length){
        for(let i=0; i < superDossie.length; i++){

            let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
            console.log("PASSOU POR AQUI??")
            if(objetoDosprevNormal){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }

           
            let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)

            if(objetoDosprevSuper){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }


            if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){
                

                const idDosprevParaPesquisaDossieNormal = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
                const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });

                const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 


                const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
                const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

                if(cpf.trim() == cpfDosprev.trim()){
                    return [normalDossie[i], 0]
                }    


            }else{

                const idDosprevParaPesquisaDossieSuper = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });

                const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 



                const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

                if(cpf.trim() == cpfDosprev.trim()){
                    return [superDossie[i], 1]
                }    

            }

        }


        for(let i = 0; i < normalDossie.length; i++){

            let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)

            if(objetoDosprev){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }

            const idDosprevParaPesquisa = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
            const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

            const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 

            const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
            const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);

            if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

            if(cpf.trim() == cpfDosprev.trim()){
                return [normalDossie[i], 1]
            }    





        }







    }else{

        for(let i=0; i < normalDossie.length; i++){

            let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 

            if(objetoDosprevNormal){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }

           
            let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)

            if(objetoDosprevSuper){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }


            if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){


                const idDosprevParaPesquisaDossieNormal = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });

                const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 


                const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

                if(cpf.trim() == cpfDosprev.trim()){
                    return [normalDossie[i], 0]
                }    


            }else{

                const idDosprevParaPesquisaDossieSuper = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });

                const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 



                const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

                if(cpf.trim() == cpfDosprev.trim()){
                    return [superDossie[i], 1]
                }    

            }

        }




        for(let i = 0; i < superDossie.length; i++){
            let objetoDosprev =  (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
    
            if(objetoDosprev){
                return new Error("DOSPREV COM FALHA NA PESQUISA")
            }
    
            const idDosprevParaPesquisa = superDossie[i].documentoJuntado.componentesDigitais[0].id;
            const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
    
            const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
    
            const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
            const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);
    
            if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
            if(cpf.trim() == cpfDosprev.trim()){
                return [superDossie[i], 1]
            }    
        }





    }


}







}