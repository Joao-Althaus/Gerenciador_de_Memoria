export default class Processo{
    
    constructor(nome,tamanho,algoritmo){
        this.nome = nome;
        this.tamanho = tamanho;
        this.algoritmo = algoritmo;
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