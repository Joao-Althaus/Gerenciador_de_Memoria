export default class endereco{

    constructor(processo, endereco){
        this.endereco = endereco;
        this.nome = processo.getNome();
        this.vazio = false;
    }

    /**
     * 
     */
    name() {
        
    } setVazio(){
        this.vazio = true;
    }


}