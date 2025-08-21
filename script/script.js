$(document).ready(function() {
        
        $('.block').draggable({
            containment:'window',
            stack: '.block',
		    snap: true,
		    snapMode: 'outer',
		    snapTolerance: 13,
        });

    	$('#blockTray').on('mousedown', function () {
		      $('#instruction').fadeOut('slow');
	    });
    
    // Make blocks rotate 90 deg on each click
        var angle = 90;    

        $('.block').click(function() {
           
            $(this).css ({
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                   '-moz-transform': 'rotate(' + angle + 'deg)',
                     '-o-transform': 'rotate(' + angle + 'deg)',
                    '-ms-transform': 'rotate(' + angle + 'deg)'
            });
            angle+=90;
        });
    let pecaSelecionada = null;
    $('.block').click(function(e) {
    // Seleciona a peça clicada
    pecaSelecionada = $(this);

    // (Opcional) Adiciona uma borda para indicar que está selecionada
    $('.block').css('box-shadow', 'none');
    pecaSelecionada.css('box-shadow', '0 0 10px 3px yellow');
});
$(document).keydown(function(e) {
    if (!pecaSelecionada) return; // nenhuma peça selecionada

    // Tecla "seta para a direita"
    if (e.key === "ArrowRight") {
        let currentAngle = pecaSelecionada.data('angle') || 0;
        currentAngle = (currentAngle + 45) % 360;
        pecaSelecionada.data('angle', currentAngle);

        pecaSelecionada.css({
            'transform': 'rotate(' + currentAngle + 'deg)',
            '-webkit-transform': 'rotate(' + currentAngle + 'deg)',
            '-moz-transform': 'rotate(' + currentAngle + 'deg)',
            '-ms-transform': 'rotate(' + currentAngle + 'deg)',
            '-o-transform': 'rotate(' + currentAngle + 'deg)'
        });
    }
});
if (e.key === "ArrowLeft") {
    let currentAngle = pecaSelecionada.data('angle') || 0;
    currentAngle = (currentAngle - 45 + 360) % 360; // evita negativo
    pecaSelecionada.data('angle', currentAngle);

    pecaSelecionada.css({
        'transform': 'rotate(' + currentAngle + 'deg)',
        '-webkit-transform': 'rotate(' + currentAngle + 'deg)',
        '-moz-transform': 'rotate(' + currentAngle + 'deg)',
        '-ms-transform': 'rotate(' + currentAngle + 'deg)',
        '-o-transform': 'rotate(' + currentAngle + 'deg)'
    });
}

});
