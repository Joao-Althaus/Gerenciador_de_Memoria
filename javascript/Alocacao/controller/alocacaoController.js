import Processo from '../entitys/processo.js'

let listaProcessos = [];

function tamanhoProcessos(){
    let memoria = listaProcessos.reduce((acc, p) => acc + parseInt(p.getTamanho()), 0);
    return memoria;
}

function mostrarLista(){
    const lista = document.getElementById("lista-processos");
    lista.innerHTML = ""; // limpa a lista antes de redesenhar

    if (listaProcessos.length === 0) {
        lista.innerHTML = `
        <div class="lista-vazia">
            <i class="fas fa-info-circle"></i>
            <p>Nenhum processo ativo</p>
        </div>
        `;
    } else {
        listaProcessos.forEach((p, index) => {
        const item = document.createElement("div");
        item.classList.add("processo-item");
        item.innerHTML = `
            <span><strong>${p.getNome()}</strong></span>
            <span>${p.getTamanho()} KB</span>
            <span>${p.getAlgoritmo()}</span>
            <button class="btn-remover" onclick="removerProcesso(${index})">
            <i class="fas fa-trash-alt"></i>
            </button>
        `;
        lista.appendChild(item);
        });
    }

    // Atualiza contador total
    document.getElementById("total-processos").innerText = listaProcessos.length;

    // Atualiza memória total
    let memoria = tamanhoProcessos();
    document.getElementById("memoria-utilizada").innerText = memoria + " KB";
}

function removerProcesso(index) {
  listaProcessos.splice(index, 1);
  atualizarLista();
}



document.getElementById("btn-adicionar").addEventListener("click", adicionar);

function adicionar(){
    let tamanhoMem = Number(tamanhoProcessos());

    let tamanhoProc = Number(document.getElementById("tamanho-processo").value);

    console.log(tamanhoMem)
    console.log(tamanhoProc)
    
    if((tamanhoMem + tamanhoProc) > 32){
        console.log(tamanhoMem + tamanhoProc)
        alert("Erro!\nSoma do Tamanho dos Processos maior do que a Memória Disponível (32Kb)");
        return
    }

    let nome = document.getElementById("nome-processo").value;
    let algoritmo = document.getElementById("algoritmo").value;

    if(nome === "" || algoritmo === "" || isNaN(tamanhoProc) || tamanhoProc <= 0){
        alert("Erro!\nPreencha todos os dados do formulário corretamente!");
        return
    }

    const novoProcesso = new Processo(nome, tamanhoProc,algoritmo);

    listaProcessos.push(novoProcesso);

    console.log(novoProcesso.getNome());
    console.log(novoProcesso.getTamanho());
    console.log(novoProcesso.getAlgoritmo());

    mostrarLista();
}