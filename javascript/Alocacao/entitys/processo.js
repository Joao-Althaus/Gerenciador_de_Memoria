export default class Processo{
    static countId = 0;

    constructor(nome,tamanho,algoritmo){
        this.pid = Processo.countId++;
        this.nome = nome;
        this.tamanho = tamanho;
        this.algoritmo = algoritmo;
    }

    getPid(){
        return this.pid;
    }

    getNome(){
        return this.nome;
    }

    
    getTamanho(){
        return this.tamanho;
    }

    
    getAlgoritmo(){
        return this.algoritmo;
    }
}