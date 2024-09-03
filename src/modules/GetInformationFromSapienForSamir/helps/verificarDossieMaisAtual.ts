import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getCPFDosPrevNormal } from "./getCPFDosPrevNormal";
import { getCPFDosPrevSuper } from "./getCPFDosPrevSuper";

export async function verificarDossieMaisAtual(cpf: string, cookie:string, normalDossie?: any[], superDossie?: any[]){
    
 try{
     if(normalDossie && !superDossie){
        console.log("-> DOSPREV: CASILLAS")

         for(let i = 0; i < normalDossie.length; i++){
             let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
             if(objetoDosprev){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }

             const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
             if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
             if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                 return [normalDossie[i], 0]
             }    
         }
     }
     
     
     if(!normalDossie && superDossie){
        console.log("-> DOSPREV: RAMOS")
         for(let i = 0; i < superDossie.length; i++){
             try{

                 const cpfDosprev = await getCPFDosPrevSuper(superDossie[i], cookie)
                 
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                    
                 if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev).trim()) {
                     return [superDossie[i], 1]
                 }    
                 
             }catch(e){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }
     
         }
     }
     
     if(normalDossie && superDossie){
        console.log('-> DOSPREV: ARBELOA')

        console.log('---QUANTIDADE DE DOSPREV 1-NORMAL, 2-SUPER')
        console.log(normalDossie.length)
        console.log(superDossie.length)

         if(normalDossie.length >= superDossie.length){
            console.log('+ ARBELOA REAL MADRID')
             for(let i=0; i < superDossie.length; i++){
                
                 let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
                 
                
                 let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!superDossie[i].documentoJuntado.componentesDigitais[0].id)

                 if(objetoDosprevNormal && !objetoDosprevSuper){

                    const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)
    
                    if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
                    if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                        return [superDossie[i], 1]
                    }

                 } else if (objetoDosprevSuper && !objetoDosprevNormal){

                     const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                         return [normalDossie[i], 0]
                     }    


                 } else {


                    if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){
                        try {
                            const cpfDosprev = await getCPFDosPrevNormal(normalDossie[i], cookie)

                            if(!cpfDosprev) throw new Error("cpf com falha na pesquisa dosprev")
        
                            if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev).trim()) {
                                return [normalDossie[i], 0]
                            }  
                        } catch (error) {
                            console.error(`Erro no documento ${normalDossie[i]}: ${error.message}`)
                        }
                
                          
                         // SHEVCHENKO: se não retornar pelo if de cima é um SHEVCHENKO (só que SUPER).
                        const cpfDosprev = await getCPFDosPrevSuper(superDossie[i], cookie)
    
                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
                        if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev).trim()){
                            return [superDossie[i], 1]
                        }
        
                    }else{
                        
                        try {
                            const cpfDosprev = await getCPFDosPrevSuper(superDossie[i], cookie)
                            console.log(cpfDosprev)
                            
                            if(!cpfDosprev) {
                                throw new Error("cpf com falha na pesquisa dosprev")
                            }
            
                            if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev).trim()){
                                return [superDossie[i], 1]
                            }    
                        } catch (error) {
                            console.error(`Erro no documento ${superDossie[i]}: ${error.message}`)
                        }

                    }

                 }
     
             }
     
     
             for(let i = 0; i < normalDossie.length; i++){
     
                 let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
     
                 if(objetoDosprev){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }
                 
                 
                 const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                 if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                     return [normalDossie[i], 0]
                 }    
     
             }
     
     
         } else {
            console.log('+ ARBELOA DEPORTIVO')

            const superDossieNaoSorted = superDossie.sort((a, b) => b.numeracaoSequencial - a.numeracaoSequencial)


            const superDossieSorted = superDossie.sort((a, b) => a.numeracaoSequencial - b.numeracaoSequencial)

            

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

                     const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                         return [normalDossie[i], 0]
                     }    
     
     
                 }else{

                    const cpfDosprevSuper = await getCPFDosPrevSuper(superDossieNaoSorted[i], cookie)

                    if(!cpfDosprevSuper) return new Error("cpf com falha na pesquisa dosprev")

                    if(cpf.trim() == CorrigirCpfComZeros(cpfDosprevSuper).trim()){
                        
                        return [superDossie[i], 1]

                    } else {
                        
                        // INZAGHI: inverte e pega o CPF do DOSPREV mais antigo (garantido de ser o do requerente).
                        const cpfDosprev = await getCPFDosPrevSuper(superDossieSorted[i], cookie)

                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                        
                        if (cpf.trim() == CorrigirCpfComZeros(( cpfDosprev).trim())) {
                            return [superDossieSorted[i], 1]
                        }    
                    }

                     
                    // SHEVCHENKO: se não retornar pelo if de cima é um SHEVCHENKO.
                    const cpfDosprev = await getCPFDosPrevNormal(normalDossie[i], cookie)
    
                    if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")

    
                    if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev).trim()){
                        return [normalDossie[i], 0]
                    }


                    // SITUAÇÃO EM QUE NÃO É O PRIMEIRO 1 (ITERAÇÃO)

                    for (let i = 0; i < superDossieNaoSorted.length; i++) {
                        console.log('+ ARBELOA LIVERPOOL')

                        const cpfDosprevOutro = await getCPFDosPrevSuper(superDossieNaoSorted[i], cookie)
    
                        if(!cpfDosprevOutro) return new Error("cpf com falha na pesquisa dosprev")
                            
                        if (cpf.trim() == CorrigirCpfComZeros((cpfDosprevOutro).trim())) {
                            return [superDossieNaoSorted[i], 1]
                        }  
                    }



                 }
     
             }
     
     
             for(let i = 0; i < superDossie.length; i++){
                 let objetoDosprev =  (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
         
                 if(objetoDosprev){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }

                 const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)
         
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
         
                 if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                     return [superDossie[i], 1]
                 }    
             }
     
     
     
     
     
         }
     
     
     }
     
     


 }  catch(e){
    return new Error("DOSPREV COM FALHA NA PESQUISA")
 }     


 




}