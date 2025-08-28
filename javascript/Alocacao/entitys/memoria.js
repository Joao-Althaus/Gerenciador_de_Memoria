import Endereco from "./endereco.js";
import Lacuna from "./lacuna.js";
import Processo from "./processo.js"

export default class Memoria{
    static enderecosFisicos = [];
    static lacunas = [];

    constructor(){
        for(let i = 0; i<32; i++){
            let end = new Endereco(i,null);
            Memoria.enderecosFisicos.push(end);
        }
        let lac = new Lacuna(0,32);
        Memoria.lacunas.push(lac);
    }

    // Getters     
    static getEnderecos(){
        return this.enderecosFisicos;
    }

    static getLacunas(){
        return this.lacunas;
    }

    // Metodos Utilitarias
    
    // calcularFragmentacao() {
    //     let frag;

    //     lacunas.array.forEach(element => {
    //         frag +=element.getTamanho();
    //     });

    //     let porcentagem = 100* frag / 32*32 - 32*frag;
    //     return porcentagem;
    // }

    static removerProcesso(processo) {
        // Correção: usar Memoria.enderecosFisicos
        Memoria.enderecosFisicos.forEach(element => {
            if (element.getProcesso() && element.getProcesso().getPid() === processo.getPid()) {
                element.setProcesso(null);
                element.setVazio(true);
            }
        });
        Memoria.atualizarLacunas();
    }


   static atualizarLacunas() {
        // Limpa a lista atual de lacunas
        Memoria.lacunas = [];
        
        let inicioLacuna = -1;
        let tamanhoLacuna = 0;
        
        // Percorre todos os endereços para encontrar lacunas (espaços livres)
        for (let i = 0; i < Memoria.enderecosFisicos.length; i++) {
            const endereco = Memoria.enderecosFisicos[i];
            
            if (endereco.isVazio()) {
                // Se é o início de uma nova lacuna
                if (inicioLacuna === -1) {
                    inicioLacuna = i;
                }
                tamanhoLacuna++;
            } else {
                // Se encontrou um endereço ocupado e tinha uma lacuna em andamento
                if (inicioLacuna !== -1) {
                    Memoria.lacunas.push(new Lacuna(inicioLacuna, tamanhoLacuna));
                    inicioLacuna = -1;
                    tamanhoLacuna = 0;
                }
            }
        }
        
        // Adiciona a última lacuna se existir
        if (inicioLacuna !== -1) {
            Memoria.lacunas.push(new Lacuna(inicioLacuna, tamanhoLacuna));
        }
        
        // Ordena as lacunas por posição (opcional, mas útil para alguns algoritmos)
        Memoria.lacunas.sort((a, b) => a.getInicio() - b.getInicio());
    }

    // Escolhe o Algoritmo de Alocacao Chamado pelo Controller
    static alocarProcesso(novoProcesso) {
        let algoritmo = novoProcesso.getAlgoritmo();

        switch (algoritmo) {
            case "first-fit":
                return Memoria.firstFit(novoProcesso);
            case "best-fit":
                return Memoria.bestFit(novoProcesso);
            case "worst-fit":
                return Memoria.worstFit(novoProcesso);
            case "circular-fit":
                return Memoria.circularFit(novoProcesso);
            default:
                console.error("Algoritmo de alocação desconhecido:", algoritmo);
                return false;
        }     
    }

    // Aloca o processo na memória a partir de uma posição
    static enderecar(processo, inicio) {
        for (let i = inicio; i < inicio + processo.getTamanho(); i++) {
            if (i >= Memoria.enderecosFisicos.length) {
                console.error("Tentativa de alocar além do limite da memória");
                return false;
            }
            
            const endereco = Memoria.enderecosFisicos[i];
            endereco.setProcesso(processo);
            endereco.setVazio(false);
        }
        
        // REMOVIDA a linha que seta a base do processo
        // processo.setBase(inicio);
        
        Memoria.atualizarLacunas();
        return true;
    }
    
    // Algoritmo First-Fit
    static firstFit(processo) {
        // Garante que as lacunas estão atualizadas
        Memoria.atualizarLacunas();
        
        // Procura a primeira lacuna que caiba o processo
        for (const lacuna of Memoria.lacunas) {
            if (lacuna.getTamanho() >= processo.getTamanho()) {
                // Encontrou uma lacuna que cabe o processo
                return Memoria.enderecar(processo, lacuna.getInicio());
            }
        }
        
        // Não encontrou lacuna adequada
        console.log("First-Fit: Não há espaço contíguo suficiente para o processo", processo.getNome());
        return false;
    }

    //  bestFit(){

    // }

    //  worstFit(){

    // }

    //  circularFit(){
        
    // }
}