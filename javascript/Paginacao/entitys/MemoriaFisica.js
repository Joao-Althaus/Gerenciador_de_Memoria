export default class MemoriaFisica{

    constructor() {
        this.memoria = Array.from({ length: 8 }, () => Array(4).fill(null)); // 8 frames × 4 posições
        this.frameLivre = Array(8).fill(true); // todos livres no início
        this.processos = [];
    }

    getMemoria(){
        return this.memoria;
    }

    getProcessos(){
        return this.processos;
    }

    getQuantidadeFramesLivres() {
        let count = 0;
        for ( let i = 0; i< this.frameLivre.length;i++) {
            if (this.frameLivre[i]) count++;
        }
        return count;
    }

    alocarProcesso(processo){
        const tamanhoProcesso = processo.getTamanho();
        const framesNecessarios =  Math.ceil(tamanhoProcesso / 4);

        if(framesNecessarios > this.getQuantidadeFramesLivres()){
            return false
        }

        const framesAlocados = [];
        let byteIndex = 0;

        for (let frame = 0; frame < this.frameLivre.length && framesAlocados.length < framesNecessarios; frame ++){
            if(this.frameLivre[frame]){
                framesAlocados.push(frame);
                this.frameLivre[frame] = false;
                for( let deslocamento = 0; deslocamento < 4 && byteIndex < tamanhoProcesso; deslocamento++){
                    this.memoria[frame][deslocamento] = {
                        processo: processo.getNome(),
                        byte: processo.getBytes()[byteIndex]
                    };
                    byteIndex++;
                }
            }
        }

        processo.configurarTLB(framesAlocados);
        this.processos.push(processo);

        return true;
    }

    
    removerProcesso(processo) {
        const index = this.processos.indexOf(processo);
        if (index === -1) return false;

        // Liberar frames na memória física
        const tlb = processo.getTlb();
        for (const [pagina, frame] of tlb) {
            this.frameLivre[frame] = true;
            // Limpar dados do frame
            for (let deslocamento = 0; deslocamento < 4; deslocamento++) {
                this.memoria[frame][deslocamento] = null;
            }
        }

        this.processos.splice(index, 1);
        return true;
    }


    limparMemoria(){
        this.memoria = Array.from({ length: 8 }, () => Array(4).fill(null));
        this.framesLivres = Array(8).fill(true);
        this.processos = [];
        return { success: true };
    }
}