const containerImagem = document.getElementById('imagem-tangram');

setTimeout(() => {
    containerImagem.classList.add('escondida');
}, 5000);

document.addEventListener('DOMContentLoaded', (event) => {
  const tempoEspera = 6000; 

  setTimeout(() => {
    const div1 = document.getElementById('blockTray');
    const div2 = document.getElementById('board');
    const div3 = document.getElementById('mostrador');

    if (div1) {
      div1.classList.remove('hidden');
    }
    if (div2) {
      div2.classList.remove('hidden');
    }
    if (div2) {
      div3.classList.remove('hidden');
    }
    
  }, tempoEspera);
});

document.addEventListener('DOMContentLoaded', (event) => {

    const divTimer = document.getElementById('timer');
    let tempoRestante = 60;

    setTimeout(() => {
        divTimer.textContent = tempoRestante;
        const timerPrincipal = setInterval(() => {
            tempoRestante--;
            divTimer.textContent = tempoRestante;
    
            if (tempoRestante <= 0) {
                clearInterval(timerPrincipal); 
                divTimer.textContent = "Tempo esgotado!";
                divTimer.style.backgroundColor = '#ff6257ff';
            }
        }, 1000); 
        
    }, 6000); 
});