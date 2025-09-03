let score = 0;
let controleVitoria = false;
let isTimeUp = false;


const savedScore = localStorage.getItem('gameScore');

if (savedScore !== null) {
  score = parseInt(savedScore, 10);
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById('score-display');
  if (scoreElement) {
    scoreElement.innerText = score;
  }
}

(function ($) {
  $(function () {
    console.log('[script2] carregado');

    // ===== CONFIG =====
    const CELL = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--cell')) || 40;
    const ROT_TOL_DEG = 10;

    const pieceSymmetry = {
      square: 90,
      triangle1: 180, triangle2: 180, triangle3: 180,
      triangle4: 180, triangle5: 180, parallelogram: 180
    };

    
    const target = {
      square:        { cell: { x: 6, y: 2 }, angle: 0,  },
      triangle1:     { cell: { x: 8, y: 3 }, angle: 0,   },
      triangle2:     { cell: { x: 7, y: 9 }, angle: 225,   },
      triangle3:     { cell: { x: 4, y: 9 }, angle: 225,   },
      triangle4:     { cell: { x: 8, y: 6 }, angle: 180,  },
      triangle5:     { cell: { x: 3, y: 4 }, angle: 0,   },
      parallelogram: { cell: { x: 5, y: 5 }, angle: 90,   flip: false }
    };

    function getBoardInnerRect() {
      const el = document.getElementById('board');
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const left = r.left + window.scrollX + parseFloat(cs.borderLeftWidth || 0);
      const top  = r.top  + window.scrollY + parseFloat(cs.borderTopWidth  || 0);
      const width  = el.clientWidth;   // sem borda
      const height = el.clientHeight;  // sem borda
      return { left, top, width, height };
    }

    function pointInsideBoard(x, y, rect) {
      return x >= rect.left && x <= rect.left + rect.width &&
             y >= rect.top  && y <= rect.top  + rect.height;
    }

    function pieceCenterPage($p) {
      const r = $p[0].getBoundingClientRect();
      return { x: r.left + r.width / 2 + window.scrollX,
               y: r.top  + r.height / 2 + window.scrollY };
    }

    function updatePieceCell($p) {
      const br = getBoardInnerRect();
      const c  = pieceCenterPage($p);
      if (!pointInsideBoard(c.x, c.y, br)) {
        $p.data('cell', null);
        return null;
      }
      const relX = c.x - br.left;
      const relY = c.y - br.top;
      const cellX = Math.round(relX / CELL);
      const cellY = Math.round(relY / CELL);
      const cell = { x: cellX, y: cellY };
      $p.data('cell', cell);
      return cell;
    }

    function rotationMatches(current, targetDeg, id) {
      const period = pieceSymmetry[id] || 360;
      const norm = (a) => ((a % 360) + 360) % 360;
      const a = norm(current) % period;
      const b = norm(targetDeg) % period;
      const diff = Math.abs(((a - b + period / 2) % period) - period / 2);
      return diff <= ROT_TOL_DEG;
    }

    function dumpEstado() {
      const br = getBoardInnerRect();
      const maxX = Math.floor(br.width / CELL);
      const maxY = Math.floor(br.height / CELL);
      console.log('--- ESTADO ---');
      $('.block').each(function () {
        const $p = $(this);
        updatePieceCell($p); // garante célula atualizada
        const c = $p.data('cell');
        const ang = $p.data('angle');
        const flp = $p.data('flip');
        console.log(this.id,
          'cell=', c ? `${c.x},${c.y}` : null,
          'angle=', ang,
          'flip=', flp
        );
      });
      console.log('BoardInnerRect=', br, 'CELL=', CELL, 'maxCells=', {
        maxX, maxY
      });
    }
   
    const divGanhou = document.getElementById('ganhou');

    function verificarEExibir() {
      divGanhou.classList.add('visivel');
  }

  function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-display');
    
    if (scoreElement) {
        scoreElement.innerText = score;
    }
}


    function handleVictory() {
          score += 100;
          localStorage.setItem('gameScore', score.toString());
          updateScoreDisplay(); 
    
}
    function checkWin() {
      // Adicione esta verificação no início
      if (isTimeUp) {
        return false;
      }
      
      // O restante da lógica de verificação de vitória segue aqui...
      $('.block').each(function () { updatePieceCell($(this)); });

      const used = new Map();
      for (const id in target) {
        const $p = $('#' + id);
        if ($p.length === 0) return false;

        const goal = target[id];
        const cell = $p.data('cell');
        const angle = $p.data('angle') || 0;
        const flip  = $p.data('flip');

        if (!cell) return false;
        if (!(cell.x === goal.cell.x && cell.y === goal.cell.y)) return false;
        if (!rotationMatches(angle, goal.angle, id)) return false;

        if (id === 'parallelogram' && goal.flip !== null) {
          if ((!!flip) !== goal.flip) return false;
        }

        const key = cell.x + ',' + cell.y;
        if (used.has(key)) return false;
        used.set(key, id);
      }
      controleVitoria = true;
      verificarEExibir();
      handleVictory()
      return true;
    }

    
    $('.block').each(function () {
      const $p = $(this);
      if ($p.data('angle') == null) $p.data('angle', 0);
      if ($p.attr('id') === 'parallelogram' && $p.data('flip') == null) $p.data('flip', false);
    });

    $(document).on('dragstop', '.block', function () {
      updatePieceCell($(this));
      dumpEstado();
      checkWin();
    });

  
    $(document).on('click', '.block', function () {
      const $p = $(this);
      setTimeout(() => { updatePieceCell($p); dumpEstado(); checkWin(); }, 0);
    });

   
    $(document).on('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
          e.key === 'ArrowUp'   || e.key === 'ArrowDown') {
        setTimeout(() => { dumpEstado(); checkWin(); }, 0);
      }
    });

    

   
    (function validateTargetFitsBoard() {
      const br = getBoardInnerRect();
      const maxX = Math.floor(br.width / CELL);
      const maxY = Math.floor(br.height / CELL);
      let ok = true;
      for (const id in target) {
        const { x, y } = target[id].cell;
        if (x < 0 || y < 0 || x > maxX || y > maxY) {
          console.warn(`[target fora do board] ${id}: (${x},${y}) — board (em células): maxX=${maxX}, maxY=${maxY}`);
          ok = false;
        }
      }
      if (!ok) console.warn('⚠️ Ajuste o tamanho do #board ou reduza x/y no target.');
    })();
  });
})(jQuery);

const containerImagem = document.getElementById('imagem-flor');

setTimeout(() => {
    containerImagem.classList.add('escondida');
}, 5000);

document.addEventListener('DOMContentLoaded', (event) => {
  const tempoEspera = 6000; 

  setTimeout(() => {
    const div1 = document.getElementById('blockTray');
    const div2 = document.getElementById('board');
    const div3 = document.getElementById('mostrador');
    const div4 = document.getElementById('score-container');
    const div5 = document.getElementById('score-display');

    if (div1) {
      div1.classList.remove('hidden');
    }
    if (div2) {
      div2.classList.remove('hidden');
    }
    if (div3) {
      div3.classList.remove('hidden');
    }
      if (div4) {
      div4.classList.remove('hidden');
    }
    if (div5) {
      div5.classList.remove('hidden');
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
                isTimeUp = true; // Defina como true quando o tempo acabar
            }
           if (controleVitoria){
               clearInterval(timerPrincipal); 
                divTimer.textContent = ":)";
                divTimer.style.backgroundColor = '#ffffffff';
                
            }
                
        }, 1000); 
        
    }, 6000); 
});