const tamanhoCelula = 40;
let pecaId = 0;
document.body.append(criaTabuleiro());

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
            celula.addEventListener('drop', drop)
            celula.dataset.lin = i
            celula.dataset.col = j
            linha.append(celula);

            celula.style.width = `${tamanhoCelula}px`;
            celula.style.height = `${tamanhoCelula}px`;
            if (i % 2 == j % 2) {
                celula.addEventListener('dragover', allowDrop)
                celula.style.backgroundColor = 'black';
                if (i * 8 + j <= 24) {
                    const peca = criaPeca('black')
                    peca.id = `b-i${i}-j${j}`
                    celula.append(peca)
                    celula.removeEventListener('dragover', allowDrop)
                } else if (i * 8 + j >= 40) {
                    const peca = criaPeca('red')
                    peca.id = `r-i${i}-j${j}`
                    peca.draggable = true
                    celula.append(peca)
                    celula.removeEventListener('dragover', allowDrop)
                }
            } else {
                celula.style.backgroundColor = 'white';
            }
        }
    };
    return tabela;
}

function jogadorDaVez() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        peca.draggable = !peca.draggable
    });
}

function criaPeca(cor) {
    let imagem = document.createElement('img');
    imagem.dataset.cor = cor
    imagem.classList.add('peca')
    imagem.setAttribute('src', `img/${cor}.png`);
    imagem.setAttribute('width', `${tamanhoCelula-4}px`);
    imagem.setAttribute('height', `${tamanhoCelula-4}px`);
    imagem.setAttribute('draggable', 'false')
    imagem.addEventListener('dragstart', drag)
    return imagem;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("imgid", ev.target.id);
}

function movimentoRegular(origem, destino) {
    const imagem = origem.querySelector(`img`)
    return ((imagem.dataset.cor == 'red' && 
             destino.dataset.lin == origem.dataset.lin-1) ||
            (imagem.dataset.cor == 'black' && 
             destino.dataset.lin-1 == origem.dataset.lin)) && 
            (destino.dataset.col == origem.dataset.col-1 ||
             destino.dataset.col-1 == origem.dataset.col)
}

function drop(ev) {
    const imgid= ev.dataTransfer.getData("imgid");
    const imagem = document.querySelector(`#${imgid}`)
    const origem = imagem.parentElement
    const destino = ev.target
    if (movimentoRegular(origem, destino)){
        origem.addEventListener('dragover', allowDrop)
        destino.appendChild(imagem);
        destino.removeEventListener('dragover', allowDrop)
        jogadorDaVez()
    }
}