$(document).ready(function () {
    $('.block').draggable({
        containment: 'window',
        stack: '.block',
        snap: true,
        snapMode: 'outer',
        snapTolerance: 13,
    });

    $('#blockTray').on('mousedown', function () {
        $('#instruction').fadeOut('slow');
    });

    let pecaSelecionada = null;

    // Rotaciona e aplica flip se for paralelogramo
    function aplicarTransformacoes(peca, angulo, flip) {
        const id = peca.attr('id');
        let transform = `rotate(${angulo}deg)`;

        if (id === 'parallelogram') {
            if (flip) {
                transform = `scaleY(-1) rotate(${angulo}deg)`;
            }
        }

        peca.css({
            'transform': transform,
            '-webkit-transform': transform,
            '-moz-transform': transform,
            '-ms-transform': transform,
            '-o-transform': transform
        });
    }

    // Clique seleciona e gira 45°
    $('.block').click(function () {
        pecaSelecionada = $(this);
        $('.block').css('box-shadow', 'none');
        pecaSelecionada.css('box-shadow', '0 0 10px 3px yellow');

        let angulo = (pecaSelecionada.data('angle') || 0) + 45;
        angulo %= 360;
        pecaSelecionada.data('angle', angulo);

        let flip = pecaSelecionada.data('flip') || false;

        aplicarTransformacoes(pecaSelecionada, angulo, flip);
    });

    // Teclado
    $(document).keydown(function (e) {
        if (!pecaSelecionada) return;

        let angulo = pecaSelecionada.data('angle') || 0;
        let flip = pecaSelecionada.data('flip') || false;

        if (e.key === 'ArrowRight') {
            angulo = (angulo + 45) % 360;
        } else if (e.key === 'ArrowLeft') {
            angulo = (angulo - 45 + 360) % 360;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // Inverte o flip apenas se for o paralelogramo
            if (pecaSelecionada.attr('id') === 'parallelogram') {
                flip = !flip;
            }
        } else {
            return;
        }

        pecaSelecionada.data('angle', angulo);
        pecaSelecionada.data('flip', flip);

        aplicarTransformacoes(pecaSelecionada, angulo, flip);
    });
});
