const tamanhoCelula = 70;
document.body.append(criaTabuleiro());

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

function drop(e) {
    e.preventDefault();

    let id = e.dataTransfer.getData("text");
    let element = document.getElementById(id);
    console.log(element.getAttribute("cor"))
    //permitir somente movimento para os blocos pretos
    //evitar que a peça sobreponha a outra
    if(
        e.target.style.backgroundColor != "white" && 
        e.target.getAttribute("draggable") == null 
    ){
        e.target.appendChild(element);
        proximoJogador();
    }  
}

function criaTabuleiro() {
    const tamanho = 8;
    let tabela = document.createElement('table');

    tabela.style.borderStyle = 'solid';
    tabela.style.borderSpacing = 0;
    tabela.style.margin = 'auto';

    for (let i = 0; i < tamanho; i++) {
        let linha = document.createElement('tr');
        tabela.append(linha);
        for (let j = 0; j < tamanho; j++) {
            let celula = document.createElement('td');
            celula.addEventListener('drop', (e) => drop(e));
            celula.addEventListener('dragover', (e) => allowDrop(e))
            linha.append(celula);

            celula.style.width = `${tamanhoCelula}px`;
            celula.style.height = `${tamanhoCelula}px`;
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
        }
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