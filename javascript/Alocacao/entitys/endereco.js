import Processo from './processo.js'

export default class Endereco{
    constructor(posicao, processo = null) {
        this.posicao = posicao;          // posição na memória
        this.processo = processo;        // armazena o objeto Processo inteiro
        this.vazio = processo ? false : true;
    }

    // Getters
    getPosicao() {
        return this.posicao;
    }

    getProcesso() {
        return this.processo;
    }

    isVazio() {
        return this.vazio;
    }

    // Setters
    setPosicao(posicao) {
        this.posicao = posicao;
    }

    setProcesso(processo) {
        this.processo = processo;
        this.vazio = processo ? false : true;
    }

    setVazio(vazio) {
        this.vazio = vazio;
        if (vazio) {
            this.processo = null;
        }
    }
}