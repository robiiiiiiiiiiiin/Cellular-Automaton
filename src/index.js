import LifeLikeAutomaton from 'class/LifeLikeAutomaton';
import Keyboard from 'class/keyboard';


/* contexte graphique */
let ctx = $("canvas").get(0).getContext("2d");
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const KEYBOARD = new Keyboard();
let bRule = [0, 0, 0, 1, 0, 0, 0, 0, 0];
let sRule = [0, 0, 1, 1, 0, 0, 0, 0, 0];
let fps = 2;
let paused = false;
let frame = 0;
let alivePercentage = 10;
let nCol = 150;
let nLine = Math.ceil((ctx.canvas.height / ctx.canvas.width) * nCol)
let flatTorus = true

let god = new LifeLikeAutomaton(nCol, nLine, flatTorus);
god.populateMatrix(alivePercentage / 100);

let timer;
let startTimer = () => {
    timer = setInterval(() => {
        // Application des règles B/S et mise à jour du canvas
        god.draw(ctx);
        god.makeLife(bRule, sRule);
        frame++;
        $('#nbIter').html(frame);
    }, 1000 / fps);
}
startTimer();

KEYBOARD.onKey('t', (event, keysPressedAskip) => console.log(event));

//////////////////////////// RULES ////////////////////////////

let setRules = (bRule, sRule) => {
    bRule.forEach((v, i) => {
        if (v) $(`[data-rule-type='b'][data-rule-num='${i}']`).addClass('applied')
    })
    sRule.forEach((v, i) => {
        if (v) $(`[data-rule-type='s'][data-rule-num='${i}']`).addClass('applied')
    })
}

$('[data-rule-type="s"]').click((evt) => {
    sRule[$(evt.currentTarget).data('rule-num')] ^= 1
    $(evt.currentTarget).toggleClass('applied')
})
$('[data-rule-type="b"]').click((evt) => {
    bRule[$(evt.currentTarget).data('rule-num')] ^= 1
    $(evt.currentTarget).toggleClass('applied')
})

//////////////////////////// Quantity buttons ////////////////////////////
$('.quantity-buttons').on('click', (evt) => {
    const fieldName = evt.target.dataset.field ?? null
    if(!fieldName) return
    const field = $(`[name="${fieldName}"]`).get(0)

    if($(evt.target).hasClass('plus')) {
        field.stepUp(1)
        field.dispatchEvent(new Event('change'))
    }
    if($(evt.target).hasClass('minus')) {
        field.stepDown(1)
        field.dispatchEvent(new Event('change'))
    }
})

//////////////////////////// FPS ////////////////////////////
$('[name="fps"]').on('change', (evt) => {
    const min = parseInt($(evt.currentTarget).attr('min')) ?? null
    const max = parseInt($(evt.currentTarget).attr('max')) ?? null
    if(min && evt.currentTarget.value < min) evt.currentTarget.value = min
    if(max && evt.currentTarget.value > max) evt.currentTarget.value = max
    else {
        fps = evt.currentTarget.value
        if (!paused) {
            clearInterval(timer);
            startTimer()
        }
    }
})

//////////////////////////// AlivePercentage ////////////////////////////
$('[name="aliveProb"]').on('change', (evt) => {
    const min = parseInt($(evt.currentTarget).attr('min')) ?? null
    const max = parseInt($(evt.currentTarget).attr('max')) ?? null
    if(min && evt.currentTarget.value < min) evt.currentTarget.value = min
    if(max && evt.currentTarget.value > max) evt.currentTarget.value = max
    else {
        alivePercentage = evt.currentTarget.value
        if (!paused) {
            clearInterval(timer);
            startTimer()
        }
    }
})

//////////////////////////// GRID SIZE ////////////////////////////
$('[name="tileSize"]').on('change', (evt) => {
    const min = parseInt($(evt.currentTarget).attr('min')) ?? null
    const max = parseInt($(evt.currentTarget).attr('max')) ?? null
    if(min && evt.currentTarget.value < min) evt.currentTarget.value = min
    if(max && evt.currentTarget.value > max) evt.currentTarget.value = max
    else {
        nCol = evt.currentTarget.value
        nLine = Math.ceil((ctx.canvas.height / ctx.canvas.width) * nCol)
    }
})


//////////////////////////// Pause ////////////////////////////
$('#playPauseButton').on('click', (evt) => {
    if (paused) {
        startTimer()
        $(evt.currentTarget).html('Pause')
        $(evt.currentTarget).css("background-color", "transparent")
        paused = false;
    } else {
        clearInterval(timer);
        $(evt.currentTarget).html('Play')
        $(evt.currentTarget).css("background-color", "green")
        paused = true;
    }
})

//////////////////////////// Reset ////////////////////////////
$('#resetButton').on('click', (evt) => {
    god = new LifeLikeAutomaton(nCol, nLine, flatTorus);
    frame=0;
    god.populateMatrix(alivePercentage / 100);
    god.draw(ctx);
    god.makeLife(bRule, sRule);
})

//////////////////////////// GESTION DU CLICK SUR LA GRILLE ////////////////////////////

let getCellClicked = (evt) => {
    let rect = $('canvas').get(0).getBoundingClientRect();
    let cellSize = god.getCellSize();
    return {
        x: Math.floor((evt.clientX - rect.left) / cellSize),
        y: Math.floor((evt.clientY - rect.top) / cellSize)
    };
}

$('canvas').on("click", (evt) => {
    let mousePos = getCellClicked(evt)
    god.toggleCell(ctx, mousePos.x, mousePos.y)
})

//////////////////////////// MAP TYPE ////////////////////////////

$('#flatTorusButton').on('click', (evt) => {
    if(!flatTorus) {
        god.toggleMapType();
        flatTorus = true;
        $(evt.currentTarget).addClass('current')
        $('#closedButton').removeClass('current')
    }
})
$('#closedButton').on('click', (evt) => {
    if(flatTorus) {
        god.toggleMapType();
        flatTorus = false;
        $(evt.currentTarget).addClass('current')
        $('#flatTorusButton').removeClass('current')
    }
})

////////////////////////////

$('#fps').val(fps);
$('#tileSize').val(nCol);
$('#aliveProb').val(alivePercentage);
if (flatTorus) $('#map').html('FLAT TORUS');
else $('#map').html('CLOSED');
setRules(bRule, sRule)