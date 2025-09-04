<h1 align="center">Simulador de Gerenciamento de Memória</h1>

<h3>Autores</h3>
 João Vitor Althaus – Matrícula: 204929  

  Rafael Maurina – Matrícula: 205380  

## Sobre o Projeto
Este simulador foi desenvolvido com o objetivo de demonstrar, de forma didática, os
principais conceitos de **gerenciamento de memória em sistemas operacionais**.  

O sistema permite a visualização e execução de diferentes estratégias de alocação de memória, possibilitando que o usuário compreenda na prática como esses algoritmos funcionam e quais os impactos de cada escolha.  

*Trabalho desenvolvido para a disciplina de Sistemas Operacionais 2 – Universidade de Passo Fundo (UPF), 2025.*

## Home
O projeto conta com uma página inicial que explica o funcionamento dos algoritmos de alocação, tanto os contíguos quanto o de paginação (em desenvolvimento).  


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



## Modo Paginação (em desenvolvimento)

<h1> Implementação futura do modo de gerenciamento de memória por paginação.



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

