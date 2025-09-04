import MemoriaFisica from '../entitys/MemoriaFisica.js';
import Processo from '../entitys/Processo.js'

let listaProcessos = [];
let memoria = new MemoriaFisica();
let processoSelecionado = null;

// ======================================
//          Configuração Inicial 
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    configurarEventListeners();
    exibirLista();
    atualizarVisualizacaoCompleta();
});

function configurarEventListeners() {
    document.getElementById('lista-processos').addEventListener('click', function(e) {
        const btnRemover = e.target.closest('.btn-remover');
        const btnExibir = e.target.closest('.btn-exibir-processo');
        
        if (btnRemover) {
            const index = parseInt(btnRemover.getAttribute('data-index'));
            removerProcesso(index);
        }
        
        if (btnExibir) {
            const nome = btnExibir.getAttribute('data-nome');
            processoSelecionado = nome;
            atualizarVisualizacaoCompleta(nome);
        }
    });
    
    document.getElementById("btn-adicionar").addEventListener("click", adicionar);
    document.getElementById("btn-remover-todos").addEventListener("click", limparMemoria);
}

// ======================================
//          Funções Auxiliares
// ======================================

function tamanhoProcessos() {
    return listaProcessos.reduce((acc, p) => acc + p.getTamanho(), 0);
}

function verificarNome(nome) {
    return !listaProcessos.some(p => p.getNome() === nome);
}

function atualizarOpcoesDisponiveis() {
    const select = document.getElementById("algoritmo");
    const options = select.options;
    const nomesUsados = listaProcessos.map(p => p.getNome());
    
    for (let i = 1; i < options.length; i++) {
        options[i].disabled = false;
    }
    
    for (let i = 1; i < options.length; i++) {
        if (nomesUsados.includes(options[i].value)) {
            options[i].disabled = true;
        }
    }
    
    if (select.options[select.selectedIndex]?.disabled) {
        select.selectedIndex = 0;
    }
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
            
            item.innerHTML = `
                <button class="btn-exibir-processo" data-nome="${p.getNome()}" title="Exibir Processo">
                    <span><strong>${p.getNome()}</strong></span>
                </button>
                <span>${p.getTamanho()} KB</span>
                <button class="btn-remover" data-index="${index}" title="Remover Processo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            lista.appendChild(item);
        });
    }

    document.getElementById("total-processos").innerText = listaProcessos.length;
    let memoriaUsada = tamanhoProcessos();
    document.getElementById("memoria-utilizada").innerText = memoriaUsada + " KB";
}

// ======================================
//          Funções de Exibição Visual
// ======================================
function exibirMemoriaFisica() {
    const memoriaData = memoria.getMemoria();
    
    // Atualizar tabela 1 (frames 0-3)
    for (let frame = 0; frame < 4; frame++) {
        for (let offset = 0; offset < 4; offset++) {
            // Cada frame ocupa 4 linhas consecutivas
            const linha = (frame * 4) + offset;
            const celula = document.querySelector(`.tabela1 tbody tr:nth-child(${linha + 1}) td:last-child`);
            const dado = memoriaData[frame][offset];
            
            if (dado) {
                celula.textContent = dado.byte;
                celula.className = 'ocupado ' + dado.processo.toLowerCase();
            } else {
                celula.textContent = '';
                celula.className = 'livre';
            }
        }
    }
    
    // Atualizar tabela 2 (frames 4-7)
    for (let frame = 4; frame < 8; frame++) {
        for (let offset = 0; offset < 4; offset++) {
            // Cada frame ocupa 4 linhas consecutivas (frames 4-7 → linhas 0-15)
            const linha = ((frame - 4) * 4) + offset;
            const celula = document.querySelector(`.tabela2 tbody tr:nth-child(${linha + 1}) td:last-child`);
            const dado = memoriaData[frame][offset];
            
            if (dado) {
                celula.textContent = dado.byte;
                celula.className = 'ocupado ' + dado.processo.toLowerCase();
            } else {
                celula.textContent = '';
                celula.className = 'livre';
            }
        }
    }
}

function exibirMemoriaLogica(processo) {
    const bytes = processo.getBytes();
    const divProcesso = document.querySelector(`.proc-${processo.getNome()}`);
    
    if (!divProcesso) return;
    
    const rows = divProcesso.querySelectorAll('.mem-logica tbody tr');
    
    for (let i = 0; i < rows.length; i++) {
        const byteCell = rows[i].querySelector('td:last-child');
        
        if (i < bytes.length) {
            byteCell.textContent = bytes[i];
            byteCell.className = 'ocupado';
        } else {
            byteCell.textContent = '';
            byteCell.className = '';
        }
    }
}

function exibirTabelaPaginas(processo) {
    const tlb = processo.getTlb();
    const divProcesso = document.querySelector(`.proc-${processo.getNome()}`);
    
    if (!divProcesso) return;
    
    const rows = divProcesso.querySelectorAll('.tabela-de-paginas tr');
    
    // Limpar tabela primeiro
    for (let i = 1; i < rows.length; i++) {
        const frameCell = rows[i].querySelector('td:last-child');
        frameCell.textContent = '----';
        frameCell.className = '';
    }
    
    // Preencher com dados da TLB (frame em binário de 3 bits)
    for (const [pagina, frame] of tlb.entries()) {
        if (pagina < rows.length - 1) {
            const frameCell = rows[pagina + 1].querySelector('td:last-child');
            // Converter frame para binário de 3 bits (0-7 → 000-111)
            const frameBinario = frame.toString(2).padStart(3, '0');
            frameCell.textContent = frameBinario;
            frameCell.className = 'ocupado';
        }
    }
}

function mostrarProcessoVisual(nomeProcesso) {
    // Esconder todos os processos
    document.querySelectorAll('.proc-A, .proc-B, .proc-C, .proc-D, .proc-E, .proc-Vazio')
        .forEach(div => div.hidden = true);
    
    // Mostrar o processo selecionado
    const divProcesso = document.querySelector(`.proc-${nomeProcesso}`);
    if (divProcesso) {
        divProcesso.hidden = false;
        return true;
    }
    
    // Mostrar vazio se não encontrado
    document.querySelector('.proc-Vazio').hidden = false;
    return false;
}

function atualizarVisualizacaoCompleta(nomeProcesso = null) {
    exibirMemoriaFisica();
    
    if (nomeProcesso) {
        const processo = listaProcessos.find(p => p.getNome() === nomeProcesso);
        if (processo && mostrarProcessoVisual(nomeProcesso)) {
            exibirMemoriaLogica(processo);
            exibirTabelaPaginas(processo);
        }
    } else if (listaProcessos.length > 0) {
        // Mostrar primeiro processo se nenhum selecionado
        const primeiroProcesso = listaProcessos[0].getNome();
        processoSelecionado = primeiroProcesso;
        atualizarVisualizacaoCompleta(primeiroProcesso);
    } else {
        // Mostrar vazio
        mostrarProcessoVisual('Vazio');
    }
    
    exibirLista();
}

// ======================================
//          Funções de Gerenciamento
// ======================================

function adicionar() {
    let tamanhoMem = tamanhoProcessos();
    let tamanhoProc = Number(document.getElementById("tamanho-processo").value);

    if (tamanhoProc > 16) {
        alert("Erro!\nProcesso maior do que permitido (16Kb)!");
        return;
    }

    if ((tamanhoMem + tamanhoProc) > 32) {
        alert("Erro!\nSoma do Tamanho dos Processos maior do que a Memória Disponível (32Kb)");
        return;
    }

    let nome = document.getElementById("algoritmo").value;

    if (nome === "" || isNaN(tamanhoProc) || tamanhoProc <= 0) {
        alert("Erro!\nPreencha todos os dados do formulário corretamente!");
        return;
    }

    if (!verificarNome(nome)) {
        alert("Erro!\nJá existe um processo com esse nome!");
        return;
    }

    const novoProcesso = new Processo(nome, tamanhoProc);
    
    // Tentar alocar na memória física
    const alocado = memoria.alocarProcesso(novoProcesso);
    if (!alocado) {
        alert("Erro!\nNão foi possível alocar o processo na memória física!");
        return;
    }

    listaProcessos.push(novoProcesso);
    processoSelecionado = nome;

    imprimirEstadoCompleto();
    
    atualizarOpcoesDisponiveis();
    atualizarVisualizacaoCompleta(nome);
    
    document.getElementById("tamanho-processo").value = "";
}

function removerProcesso(index) {
    let processo = listaProcessos[index];
    
    // Remover da memória física
    const removido = memoria.removerProcesso(processo);
    if (!removido) {
        alert("Erro ao remover processo da memória!");
        return;
    }
    
    listaProcessos.splice(index, 1);

    // Atualizar processo selecionado
    if (processoSelecionado === processo.getNome()) {
        processoSelecionado = listaProcessos.length > 0 ? listaProcessos[0].getNome() : null;
    }

    atualizarOpcoesDisponiveis();
    atualizarVisualizacaoCompleta(processoSelecionado);
}

function limparMemoria() {
    if (confirm("Tem certeza que deseja limpar toda a memória? \nTodos os processos serão removidos.")) {
        memoria.limparMemoria();
        listaProcessos = [];
        processoSelecionado = null;
        
        atualizarOpcoesDisponiveis();
        atualizarVisualizacaoCompleta();
    }
}

// ======================================
//          Export para testes
// ======================================

export { listaProcessos, memoria, processoSelecionado };


function imprimirEstadoMemoria() {
    console.log('=== ESTADO DA MEMÓRIA FÍSICA ===');
    const memoriaData = memoria.getMemoria();
    
    for (let frame = 0; frame < 8; frame++) {
        let linha = `Frame ${frame} (${frame.toString(2).padStart(3, '0')}): `;
        for (let offset = 0; offset < 4; offset++) {
            const dado = memoriaData[frame][offset];
            if (dado) {
                linha += `[${dado.byte}] `;
            } else {
                linha += '[Livre] ';
            }
        }
        console.log(linha);
    }
    
    console.log('Frames livres:', memoria.getQuantidadeFramesLivres(), '/ 8');
}

function imprimirProcessos() {
    console.log('=== PROCESSOS ATIVOS ===');
    
    if (listaProcessos.length === 0) {
        console.log('Nenhum processo ativo');
        return;
    }
    
    listaProcessos.forEach((processo, index) => {
        console.log(`\nProcesso ${index + 1}:`);
        console.log(`- Nome: ${processo.getNome()}`);
        console.log(`- Tamanho: ${processo.getTamanho()} bytes`);
        console.log(`- Bytes: [${processo.getBytes().join(', ')}]`);
        
        // Imprimir TLB (Tabela de Páginas)
        const tlb = processo.getTlb();
        if (tlb.size > 0) {
            console.log('- TLB (Página → Frame):');
            for (const [pagina, frame] of tlb.entries()) {
                console.log(`  Página ${pagina.toString(2).padStart(3, '0')} → Frame ${frame} (${frame.toString(2).padStart(3, '0')})`);
            }
        } else {
            console.log('- TLB: Vazia (não alocado)');
        }
        
        console.log(`- Frames alocados: ${Array.from(tlb.values()).join(', ')}`);
    });
    
    console.log(`\nTotal: ${listaProcessos.length} processo(s)`);
    console.log(`Memória utilizada: ${tamanhoProcessos()} / 32 bytes`);
}

function imprimirEstadoCompleto() {
    console.clear();
    console.log('=== SISTEMA DE PAGINAÇÃO - ESTADO COMPLETO ===');
    console.log('=============================================');
    
    imprimirProcessos();
    console.log('\n');
    imprimirEstadoMemoria();
    
    console.log('\n=== MEMÓRIA POR FRAME ===');
    const memoriaData = memoria.getMemoria();
    memoriaData.forEach((frame, frameIndex) => {
        const ocupado = frame.some(celula => celula !== null);
        console.log(`Frame ${frameIndex} (${frameIndex.toString(2).padStart(3, '0')}): ${ocupado ? 'Ocupado' : 'Livre'}`);
    });
}

function imprimirAlocacaoDetalhada() {
    console.log('=== ALOCAÇÃO DETALHADA ===');
    
    listaProcessos.forEach(processo => {
        console.log(`\nProcesso ${processo.getNome()}:`);
        const tlb = processo.getTlb();
        
        tlb.forEach((frame, pagina) => {
            console.log(`  Página ${pagina.toString(2).padStart(3, '0')} → Frame ${frame}`);
            
            // Mostrar bytes específicos desta página
            const inicio = pagina * 4;
            const fim = Math.min(inicio + 4, processo.getTamanho());
            const bytesPagina = processo.getBytes().slice(inicio, fim);
            
            console.log(`    Bytes: [${bytesPagina.join(', ')}]`);
        });
    });
}