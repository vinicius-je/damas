// econtrar um modo de identificar se a peça foi para direita ou esquerda para remover a peça correta || casos especificos

const jogoDeDamas = {
    tabuleiro: [],
    tamanhoCelula: 70,

    gerarID: function() {
        return Math.floor(Date.now() * Math.random()).toString(36);
    },

    allowDrop: function(e) {
        e.preventDefault();
    },
    
    drag: function(e) {
        e.dataTransfer.setData("text", e.target.id);
    },

    drop: function(e) {
        e.preventDefault();
        //posicao final
        let posFinal = JSON.parse(e.target.getAttribute('posicao'));
        console.log(posFinal)
        let id = e.dataTransfer.getData("text");
        let element = document.getElementById(id);
        let cor = element.getAttribute("cor")
        let posInicial = this.posicaoPeca(id, this.tabuleiro);
        //permitir somente movimento para os blocos pretos
        //evitar que a peça sobreponha a outra
        if(
            e.target.style.backgroundColor != "white" && 
            e.target.getAttribute("draggable") == null &&
            this.validaMovimento(posInicial, posFinal, cor)
        ){
            e.target.appendChild(element);
            this.trocaPosicaoPeca(posInicial, posFinal)
            this.proximoJogador();
        }  
    },

    criaPeca: function(cor) {
        let imagem = document.createElement('img');
        imagem.setAttribute('src', `img/${cor}.png`);
        imagem.setAttribute('cor', cor)
        imagem.setAttribute('width', `${this.tamanhoCelula-4}px`);
        imagem.setAttribute('height', `${this.tamanhoCelula-4}px`);

        if(cor == "black")
            imagem.setAttribute('draggable', true);
        else
            imagem.setAttribute('draggable', false);

        imagem.setAttribute('id', this.gerarID());
        imagem.addEventListener('dragstart', (e) => this.drag(e))
        return imagem;
    },

    criaTabuleiro: function() {
        const tamanho = 8;
        let tabela = document.createElement('table');
        console.log(this.tabuleiro)
        tabela.style.borderStyle = 'solid';
        tabela.style.borderSpacing = 0;
        tabela.style.margin = 'auto';

        for (let i = 0; i < tamanho; i++) {
            let linha = document.createElement('tr');
            let linhaTabuleiro = []
            tabela.append(linha);
            for (let j = 0; j < tamanho; j++) {
                let celula = document.createElement('td');
                celula.addEventListener('drop', (e) => this.drop(e, this.tabuleiro));
                celula.addEventListener('dragover', (e) => this.allowDrop(e, this.tabuleiro))
                linha.append(celula);
                celula.style.width = `${this.tamanhoCelula}px`;
                celula.style.height = `${this.tamanhoCelula}px`;
                celula.setAttribute('posicao', JSON.stringify({linha: i, coluna: j}))

                if (i % 2 == j % 2) {
                    celula.style.backgroundColor = 'black';
                    if (i * 8 + j <= 24) {
                        celula.append(this.criaPeca('black'));
                    } else if (i * 8 + j >= 40) {
                        celula.append(this.criaPeca('red'));
                    }
                } else {
                    celula.style.backgroundColor = 'white';
                }

                let conteudo = celula.firstChild != null ?  celula.firstChild.getAttribute('id') : 'vazio'
                linhaTabuleiro.push(conteudo)
            }
            this.tabuleiro.push(linhaTabuleiro)
        };
        return tabela;
    },

    posicaoPeca: function(id) {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.tabuleiro[i][j] == id) return {linha:i, coluna:j};   
            }
        }
    },
    
    temPecaAlvo: function(posX, posY, cor) {

        console.log('X: ' + posX  + ' Y:' + posY)
        let id = this.tabuleiro[posX][posY]
        console.log("id econtrado: " + id)
        if(id != 'vazio' && id != null){
            let element = document.getElementById(id)
            console.log(element)
            let elementColor = element.getAttribute('cor');
            if(elementColor != cor) {
                setTimeout(() => {
                    let squad = element.parentElement
                    console.log(squad)
                    squad.innerHTML = ''
                }, 1000)
                return true
            }
        }
        return false
    },
    
    validaMovimento: function(posInicial, posFinal, cor) {
        let difLinha = posFinal.linha - posInicial.linha;
        let difColuna = posFinal.coluna - posInicial.coluna;
        console.log(cor)
        console.log("dif linha: " + difLinha)
        console.log("dif coluna " + difColuna)
    
        // console.log(difLinha)
        // console.log(difColuna)
        if(difLinha > 1 || difColuna > 1){
            console.log('entrou')
            if(cor == 'black'){
                console.log('first')
                console.log("inicio: " + JSON.stringify(posInicial))
                console.log("fim: " + JSON.stringify(posFinal))
                return this.temPecaAlvo(posFinal.linha - 1, posFinal.coluna + 1, cor) || this.temPecaAlvo(posFinal.linha - 1, posFinal.coluna - 1, cor);
            }
        }
    
        // if(difLinha > 1 || difColuna > 1)
        //     return false
        
        if(difLinha < -1 || difColuna < -1){
            if(cor == 'red'){
                console.log('first')
                console.log("inicio: " + JSON.stringify(posInicial))
                console.log("fim: " + JSON.stringify(posFinal))
                return this.temPecaAlvo(posFinal.linha + 1, posFinal.coluna + 1, cor) || this.temPecaAlvo(posFinal.linha + 1, posFinal.coluna - 1, cor);
            }
            return false
            
        }
            // return false
        
        return true
    },

    trocaPosicaoPeca: function(posInicial, posFinal) {
        let aux = this.tabuleiro[posInicial.linha][posInicial.coluna];
        this.tabuleiro[posInicial.linha][posInicial.coluna] = this.tabuleiro[posFinal.linha][posFinal.coluna];
        this. tabuleiro[posFinal.linha][posFinal.coluna] = aux;
    },

    proximoJogador: function () {
        const element = document.querySelectorAll("img[draggable]");
        element.forEach(item => {
            item.draggable = !item.draggable
        })
    },

    //função dev
    exibirTabuleiro: function() {
        console.log(this.tabuleiro)
    }
}