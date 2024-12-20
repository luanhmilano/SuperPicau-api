import { parse } from "date-fns";
export function VerificacaoDaQuantidadeDeDiasParaInspirarODossie(dosPrev: string): number {
    //Exemplo: dosprev = * "Informações extraídas dos sistemas informatizados do INSS em: 10/08/2022 11:58:28"
    //Obtendo somente a data em string
    const dateString = dosPrev.split(": ")[1];
    //console.log("sadasdd "+dateString)
    // Converter a string para um objeto Date
    const dateObject = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());

    // Calcular a diferença entre a data fornecida e a data atual em milisegundos
    const difference = Date.now() - dateObject.getTime();

    // Converter a diferença de milisegundos para dias
    const differenceInDays = difference / (1000 * 60 * 60 * 24);
    
    return 60 - Math.floor(differenceInDays);
}