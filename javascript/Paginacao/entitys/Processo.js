export default class Processo{

    constructor(nome,tamanho){
        this.nome = nome;
        this.tamanho = tamanho;
        this.bytes = [];
        this.tlb = new Map(); 

        for(let i = 0; i < tamanho; i++) {
            this.bytes.push(nome + (i + 1)); 
        }
    }

    getNome(){
        return this.nome;
    }

    getTamanho(){
        return this.tamanho;
    }

    getBytes(){
        return this.bytes;
    }

    getTlb(){
        return this.tlb;
    }

    configurarTLB(framesAlocados) {
        this.tlb.clear();
        // Mapear cada página lógica para seu frame físico
        for (let pagina = 0; pagina < framesAlocados.length; pagina++) {
            this.tlb.set(pagina, framesAlocados[pagina]);
        }
    }

}