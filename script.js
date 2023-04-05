const jogo = () => {
    document.body.append(jogoDeDamas.criaTabuleiro());
    document.querySelector('button')
        .addEventListener('click', () => jogoDeDamas.exibirTabuleiro())
}

window.addEventListener('DOMContentLoaded', jogo)