
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

    function ganhou() {
      alert('🎉 Você ganhou!');
    }

    function checkWin() {
      // atualiza células de todas as peças
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
      ganhou();
      return true;
    }

    // ===== INICIALIZA defaults (evita undefined) =====
    $('.block').each(function () {
      const $p = $(this);
      if ($p.data('angle') == null) $p.data('angle', 0);
      if ($p.attr('id') === 'parallelogram' && $p.data('flip') == null) $p.data('flip', false);
    });

    // ===== EVENTOS (após funções) =====
    // drop da peça
    $(document).on('dragstop', '.block', function () {
      updatePieceCell($(this));
      dumpEstado();
      checkWin();
    });

    // após girar por clique
    $(document).on('click', '.block', function () {
      const $p = $(this);
      setTimeout(() => { updatePieceCell($p); dumpEstado(); checkWin(); }, 0);
    });

    // após girar/flipar por teclado
    $(document).on('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
          e.key === 'ArrowUp'   || e.key === 'ArrowDown') {
        setTimeout(() => { dumpEstado(); checkWin(); }, 0);
      }
    });

    // botão de debug
    const btn = document.createElement('button');
    btn.textContent = '🧪 Debug';
    Object.assign(btn.style, {
      position: 'fixed', right: '16px', bottom: '16px',
      padding: '8px 12px', borderRadius: '8px',
      border: '1px solid #999', background: '#fff', cursor: 'pointer', zIndex: 99999
    });
    btn.onclick = dumpEstado;
    document.body.appendChild(btn);

    // sanity: confere se target cabe no board
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
