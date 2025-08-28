import Processo from '../entitys/processo.js';
import Memoria from '../entitys/memoria.js';

let listaProcessos = [];
let memoria = new Memoria();

// ======================================
//          Configuração Inicial 
// ======================================

// Execute esta função UMA VEZ quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    configurarEventListeners();
    exibirLista(); // Exibe a lista inicial (vazia)
    exibirMemoria(); // Exibe o estado inicial da memória
});

function configurarEventListeners() {
    // Configura o event delegation para os botões de remover
    document.getElementById('lista-processos').addEventListener('click', function(e) {
        const btnRemover = e.target.closest('.btn-remover');
        if (btnRemover) {
            const index = parseInt(btnRemover.getAttribute('data-index'));
            removerProcesso(index);
        }
    });
    
    // Configura o botão de adicionar
    document.getElementById("btn-adicionar").addEventListener("click", adicionar);
    
    // Configura o botão de limpar memória
    document.getElementById("btn-remover-todos").addEventListener("click", limparMemoria);
}

// ======================================
//          Funções utilitárias 
// ======================================

function tamanhoProcessos() {
    return listaProcessos.reduce((acc, p) => acc + p.getTamanho(), 0);
}

// ======================================
//          Exibição de Processos
// ======================================

function exibirLista() {
    const lista = document.getElementById("lista-processos");
    lista.innerHTML = "";

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
            
            // Use data-index em vez de onclick
            item.innerHTML = `
                <span><strong>${p.getNome()}</strong></span>
                <span>${p.getTamanho()} KB</span>
                <span>${p.getAlgoritmo()}</span>
                <button class="btn-remover" data-index="${index}" title="Remover Processo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            lista.appendChild(item);
        });
    }

    // Atualiza contador total
    document.getElementById("total-processos").innerText = listaProcessos.length;

    // Atualiza memória total
    let memoriaUsada = tamanhoProcessos();
    document.getElementById("memoria-utilizada").innerText = memoriaUsada + " KB";

    // Atualiza estatísticas de fragmentação (se implementado)
    // const fragmentacao = Memoria.calcularFragmentacao();
    // document.getElementById("fragmentacao").innerText = fragmentacao + "%";
}

// ======================================
//          Exibição da Memória
// ======================================

function exibirMemoria() {
    const enderecos = Memoria.getEnderecos(); // Método estático
    
    // Adicione verificação de segurança
    if (!enderecos || !Array.isArray(enderecos)) {
        console.error("Endereços não disponíveis");
        return;
    }
    
    enderecos.forEach((endereco, index) => {
        const card = document.querySelector(`.endereco-card[data-endereco="${index}"]`);
        if (card) {
            const content = card.querySelector(".endereco-content");
            if (endereco.isVazio()) {
                card.classList.remove("celula-ocupada");
                card.classList.add("celula-livre");
                content.innerText = "LIVRE";
            } else {
                card.classList.remove("celula-livre");
                card.classList.add("celula-ocupada");
                // Adicione verificação para processo não nulo
                if (endereco.getProcesso()) {
                    content.innerText = endereco.getProcesso().getNome();
                } else {
                    content.innerText = "ERRO";
                }
            }
        }
    });
}

// ======================================
//          Funções de Gerenciamento
// ======================================

function adicionar() {
    let tamanhoMem = tamanhoProcessos();
    let tamanhoProc = Number(document.getElementById("tamanho-processo").value);

    if ((tamanhoMem + tamanhoProc) > 32) {
        alert("Erro!\nSoma do Tamanho dos Processos maior do que a Memória Disponível (32Kb)");
        return;
    }

    let nome = document.getElementById("nome-processo").value;
    let algoritmo = document.getElementById("algoritmo").value;

    if (nome === "" || algoritmo === "" || isNaN(tamanhoProc) || tamanhoProc <= 0) {
        alert("Erro!\nPreencha todos os dados do formulário corretamente!");
        return;
    }

    const novoProcesso = new Processo(nome, tamanhoProc, algoritmo);

    // Use o método estático para alocar
    let alocado = Memoria.alocarProcesso(novoProcesso);
    if (!alocado) {
        alert("Erro!\nNão foi possível alocar o processo na memória.");
        return;
    }

    listaProcessos.push(novoProcesso);
    exibirLista();
    exibirMemoria();
    
    // Limpa o formulário após adicionar
    document.getElementById("nome-processo").value = "";
    document.getElementById("tamanho-processo").value = "";
}

function removerProcesso(index) {
    // Verifica se o índice é válido
    if (index < 0 || index >= listaProcessos.length) {
        console.error("Índice de processo inválido:", index);
        return;
    }
    
    const processo = listaProcessos[index];
    
    // Verifica se o processo é válido
    if (!processo) {
        console.error("Processo não encontrado no índice:", index);
        return;
    }
    
    console.log("Removendo processo:", processo.getNome(), "PID:", processo.getPid());
    
    // Remova da memória
    Memoria.removerProcesso(processo);
    
    // Remova da lista de processos ativos
    listaProcessos.splice(index, 1);
    
    // Atualize a exibição
    exibirLista();
    exibirMemoria();
    
    console.log("Processo removido com sucesso.");
}

function limparMemoria() {
    if (confirm("Tem certeza que deseja limpar toda a memória? \nTodos os processos serão removidos.")) {
        // Remove todos os processos da memória
        listaProcessos.forEach(processo => {
            Memoria.removerProcesso(processo);
        });
        
        // Limpa a lista de processos
        listaProcessos = [];
        
        // Atualiza a exibição
        exibirLista();
        exibirMemoria();
        
        alert("Memória limpa com sucesso!");
    }
}