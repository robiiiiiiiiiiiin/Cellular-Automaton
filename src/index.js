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
let nCol = 100;
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

//////////////////////////// FPS ////////////////////////////

KEYBOARD.onKey('w', (event, keysPressedAskip) => {
    if (fps != 250) {
        fps++;
        if (!paused) {
            clearInterval(timer);
            startTimer()
        }
        $('#fps').html(fps);
    }
});
KEYBOARD.onKey('s', (event, keysPressedAskip) => {
    if (fps != 1) {
        fps--;
        if (!paused) {
            clearInterval(timer);
            startTimer()
        }
        $('#fps').html(fps);
    }
});

//////////////////////////// Pause ////////////////////////////

KEYBOARD.onKey('p', (event, keysPressedAskip) => {
    if (paused) {
        startTimer()
        paused = false;
    } else {
        clearInterval(timer);
        paused = true;
    }
});

//////////////////////////// Reset ////////////////////////////

KEYBOARD.onKey('r', (event, keysPressedAskip) => {
    god = new LifeLikeAutomaton(nCol, nLine, flatTorus);
    god.populateMatrix(alivePercentage / 100);
    god.draw(ctx);
    god.makeLife(bRule, sRule);
});

//////////////////////////// AlivePercentage ////////////////////////////

KEYBOARD.onKey('a', (event, keysPressedAskip) => {
    if (alivePercentage >= 1) {
        alivePercentage--;
        $('#aliveProb').html(alivePercentage + '%');
    }
});
KEYBOARD.onKey('d', (event, keysPressedAskip) => {
    if (alivePercentage < 100) {
        alivePercentage++;
        $('#aliveProb').html(alivePercentage + '%');
    }
});

//////////////////////////// GRID SIZE ////////////////////////////

KEYBOARD.onKey('z', (event, keysPressedAskip) => {
    if (nCol < 500) {
        nCol += 10;
        nLine = Math.ceil((ctx.canvas.height / ctx.canvas.width) * nCol)
        $('#tileSize').html(nCol);
    }
});
KEYBOARD.onKey('h', (event, keysPressedAskip) => {
    if (nCol > 10) {
        nCol -= 10;
        nLine = Math.ceil((ctx.canvas.height / ctx.canvas.width) * nCol)
        $('#tileSize').html(nCol);
    }
});

//////////////////////////// GESTION DU CLICK SUR LA GRILLE ////////////////////////////

let getCellClicked = (evt) => {
    let rect = $('canvas').get(0).getBoundingClientRect();
    let cellSize = god.getCellSize();
    return {
        x: Math.floor((evt.clientX - rect.left) / cellSize),
        y: Math.floor((evt.clientY - rect.top) / cellSize)
    };
}

$('canvas').click((evt) => {
    let mousePos = getCellClicked(evt)
    god.toggleCell(ctx, mousePos.x, mousePos.y)
})

//////////////////////////// MAP TYPE ////////////////////////////

KEYBOARD.onKey('m', (event, keysPressedAskip) => {
    god.toggleMapType();
    flatTorus ^= true;
    if (flatTorus) $('#map').html('FLAT TORUS');
    else $('#map').html('CLOSED');
});

////////////////////////////

$('#fps').html(fps);
$('#tileSize').html(nCol);
$('#aliveProb').html(alivePercentage + '%');
if (flatTorus) $('#map').html('FLAT TORUS');
else $('#map').html('CLOSED');
setRules(bRule, sRule)