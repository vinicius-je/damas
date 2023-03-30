const tamanhoCelula = 70;

window.addEventListener('DOMContentLoaded', jogo)

function jogo(){
    let matriz = [];
    document.body.append(criaTabuleiro(matriz));
    document.querySelector('button').addEventListener('click', () => console.log(matriz));
}

function posicaoPeca(id, matriz){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(matriz[i][j] == id) return {linha:i, coluna:j};   
        }
    }
}

function validaMovimento(posInicial, posFinal, cor){
    let difLinha = posFinal.linha - posInicial.linha;
    let difColuna = posFinal.coluna - posInicial.coluna;

    console.log(difLinha)
    console.log(difColuna)
    if(difLinha > 1 || difColuna > 1 && cor == 'black')
        return false
    
    if(difLinha < -1 || difColuna < -1 && cor != 'black')
        return false
    
    return true
}

function trocaPosicaoPeca(posInicial, posFinal, matriz){
    let aux = matriz[posInicial.linha][posInicial.coluna];
    matriz[posInicial.linha][posInicial.coluna] = matriz[posFinal.linha][posFinal.coluna];
    matriz[posFinal.linha][posFinal.coluna] = aux;
}

function gerarID(){
    return Math.floor(Date.now() * Math.random()).toString(36);
}

function proximoJogador(){
    const element = document.querySelectorAll("img[draggable]");
    element.forEach(item => {
        item.draggable = !item.draggable
    })
}

function allowDrop(e) {
    e.preventDefault();
}

function drag(e){
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e, matriz) {
    e.preventDefault();
    //posicao final
    let posFinal = JSON.parse(e.target.getAttribute('posicao'));
    console.log(posFinal)
    let id = e.dataTransfer.getData("text");
    let element = document.getElementById(id);
    let cor = element.getAttribute("cor")
    let posInicial = posicaoPeca(id, matriz);
    //permitir somente movimento para os blocos pretos
    //evitar que a peça sobreponha a outra
    if(
        e.target.style.backgroundColor != "white" && 
        e.target.getAttribute("draggable") == null &&
        validaMovimento(posInicial, posFinal)
    ){
        e.target.appendChild(element);
        trocaPosicaoPeca(posInicial, posFinal, matriz, cor)
        proximoJogador();
    }  
}

function criaTabuleiro(matriz) {
    const tamanho = 8;
    let tabela = document.createElement('table');

    tabela.style.borderStyle = 'solid';
    tabela.style.borderSpacing = 0;
    tabela.style.margin = 'auto';


    for (let i = 0; i < tamanho; i++) {
        let linha = document.createElement('tr');
        let linhaMatriz = []
        tabela.append(linha);
        for (let j = 0; j < tamanho; j++) {
            let celula = document.createElement('td');
            celula.addEventListener('drop', (e) => drop(e, matriz));
            celula.addEventListener('dragover', (e) => allowDrop(e, matriz))
            linha.append(celula);
            celula.style.width = `${tamanhoCelula}px`;
            celula.style.height = `${tamanhoCelula}px`;
            celula.setAttribute('posicao', JSON.stringify({linha: i, coluna: j}))
            if (i % 2 == j % 2) {
                celula.style.backgroundColor = 'black';
                if (i * 8 + j <= 24) {
                    celula.append(criaPeca('black'));
                } else if (i * 8 + j >= 40) {
                    celula.append(criaPeca('red'));
                }
            } else {
                celula.style.backgroundColor = 'white';
            }

            let conteudo = celula.firstChild != null ?  celula.firstChild.getAttribute('id') : 'vazio'
            linhaMatriz.push(conteudo)
        }
        matriz.push(linhaMatriz)
    };
    return tabela;
}

function criaPeca(cor) {
    let imagem = document.createElement('img');
    imagem.setAttribute('src', `img/${cor}.png`);
    imagem.setAttribute('cor', cor)
    imagem.setAttribute('width', `${tamanhoCelula-4}px`);
    imagem.setAttribute('height', `${tamanhoCelula-4}px`);

    if(cor == "black")
        imagem.setAttribute('draggable', true);
    else
        imagem.setAttribute('draggable', false);

    imagem.setAttribute('id', gerarID());
    imagem.addEventListener('dragstart', (e) => drag(e))
    return imagem;
}
