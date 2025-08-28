export default class Lacuna{
    constructor(inicio,tamanho){
        this.inicio = inicio;
        this.tamanho = tamanho;
    }

    // Getters
    getInicio(){
        return this.inicio;
    }

    getTamanho(){
        return this.tamanho;
    }
    
    // Setters
    setInicio(inicio){
        this.inicio = inicio;
        return;
    }

    setTamanho(tamanho){
        this.tamanho = tamnho;
        return;
    }
}