<h1 align="center">Simulador de Gerenciamento de Memória</h1>

<h2 style="border-bottom: none;">Autores</h2>                     

João Vitor Althaus Godoi – Matrícula: 204929  
Rafael Maurina – Matrícula: 205380  

## Sobre o Projeto
Este simulador foi desenvolvido com o objetivo de demonstrar, de forma didática, os
principais conceitos de **gerenciamento de memória em sistemas operacionais**.  

O sistema permite a visualização e execução de diferentes estratégias de alocação de memória, possibilitando que o usuário compreenda na prática como esses algoritmos funcionam e quais os impactos de cada escolha.  

#### ♦ *Projeto acadêmico desenvolvido como parte da disciplina **Sistemas Operacionais 2**, do curso de **Ciência da Computação** da **Universidade de Passo Fundo (UPF)**, no ano de 2025.*
 

## Home
O projeto conta com uma página inicial que explica o funcionamento dos algoritmos de alocação, tanto os contíguos quanto o de paginação.  

## Modo Contíguo

### Alocação de Processos
- Criação de processos com tamanhos variados (1–32 KB).  
- Algoritmos implementados:
  - First-Fit: aloca no primeiro espaço livre encontrado.  
  - Best-Fit: aloca no menor espaço livre que caiba o processo.  
  - Worst-Fit: aloca no maior espaço livre disponível.  
  - Circular-Fit (Next-Fit): aloca a partir da última posição usada.  

### Visualização da Memória
- Grid interativo com 32 endereços de memória.  
- Representação clara de:
  - Espaços livres (LIVRE)  
  - Espaços ocupados (nome do processo)  
- Diferenciação por cores para espaços livres e alocados.  

### Estatísticas e Métricas
- Contagem de processos ativos.  
- Total de memória utilizada (em KB).  
- Cálculo de fragmentação externa.  

### Gerenciamento de Processos
- Remoção individual de processos.  
- Limpeza completa da memória.  


## Modo Paginação

### Implementação do Gerenciamento de Memória por Paginação
O modo de paginação divide tanto a memória física quanto a lógica em blocos de tamanho fixo chamados **frames** (na memória física) e **páginas** (na memória lógica).  

### Características do Sistema
- **Memória Física**: 32 KB divididos em 8 frames de 4 KB cada  
- **Tamanho de Página**: 4 KB (mesmo tamanho dos frames)  
- **Processos**: até 5 simultâneos  
- **Tamanho Máximo por Processo**: 16 KB (4 páginas)  
- **Tabela de Páginas**: implementada por processo  

### Funcionamento
Cada processo possui seu próprio espaço de endereçamento lógico dividido em páginas de 4 KB. Para cada processo, o sistema mantém:  
- **Memória Lógica**: espaço virtual do processo  
- **Tabela de Páginas**: mapeamento entre páginas virtuais e frames físicos  

### Visualização da Tabela de Endereços Lógicos
Cada processo exibe sua tabela lógica com:  
- **Endereço Lógico**: formato binário de 3 bits (000 a 011)  
- **Deslocamento**: 2 bits (00 a 11) representando 4 posições por página  
- **Byte**: conteúdo armazenado em cada posição  

### Tabela de Páginas
Cada processo possui sua própria tabela de páginas que mapeia:  
- **Páginas Virtuais (3 bits)** → identificador da página no espaço lógico  
- **Frames Físicos (3 bits)** → localização real na memória física (000 a 111)  

💡 No simulador, a tabela de páginas de cada processo funciona de forma semelhante a uma **TLB** (Translation Lookaside Buffer), que é uma implementação prática desse mapeamento em sistemas reais. 

### Estatísticas e Métricas
- Contagem de processos ativos (máximo 5)  
- Total de memória utilizada (em KB)  
- Visualização de frames livres e alocados  
- Visualização completa do mapeamento página–frame por processo  

### Interface de Visualização
- Memória física representada em duas tabelas (frames 0–3 e 4–7)  
- Tabela de páginas individual para cada processo ativo  
- Diferenciação por cores para identificação dos processos  
- Atualização em tempo real do estado da memória  

Este modo demonstra os fundamentos da paginação, incluindo a tradução de endereços virtuais para físicos e o gerenciamento de espaços de endereçamento independentes para cada processo.  

## Tecnologias Utilizadas
- HTML5 – Estrutura da interface  
- CSS3 – Estilização e layout responsivo  
- JavaScript (ES6+) – Lógica de negócio e algoritmos  
- Font Awesome – Ícones e elementos visuais  

## Como Executar
1. Clone este repositório:
   ```bash
   git clone https://github.com/Joao-Althaus/Gerenciador_de_Memoria.git
2. Abra o projeto no seu editor de preferência (ex.: VS Code).

3. Inicie o Live Server e comece a navegar pelo simulador através das páginas HTML.
