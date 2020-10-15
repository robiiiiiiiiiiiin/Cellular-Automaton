export default class {
    constructor (nCol, nLine, flatTorus = true, aliveColor = 'green', deadColor = '#111111', gridColor = '#222222', borderSize = 1) {
        this.nCol = nCol
        this.nLine = nLine
        this.flatTorus = flatTorus
        this.aliveColor = aliveColor;
        this.deadColor = deadColor;
        this.gridColor = gridColor;
        this.matrix = [];
        this.oldMatrix = [];
        this.cellSize = null;
        this.borderSize = borderSize
        this.drawSize = null;
    }

    populateMatrix(probability){
        this.matrix = []
        for (let row = 0; row < this.nLine; row++) {
            this.matrix[row] = [];
            this.oldMatrix[row] = [];
            for (let col = 0; col < this.nCol; col++) {
                this.matrix[row][col] = Math.random() <= probability;
                this.oldMatrix[row][col] = !this.matrix[row][col]
            }
        }
    }

    draw(ctx){
        let width = ctx.canvas.width;
        this.cellSize = width/this.nCol;
        this.drawSize = this.cellSize - this.borderSize;
        ctx.clearRect(0 ,0 , ctx.canvas.width, ctx.canvas.height)

        let x = 0;
        let nx = 0;
        let y = 0;
        let ny = 0;
        this.matrix.forEach(row => {
            row.forEach(cell => {
                //ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                //if(this.matrix[nx][ny] != this.oldMatrix[nx][ny]){
                    if(cell) {
                        ctx.fillStyle = this.aliveColor;
                        ctx.fillRect(x, y, this.drawSize, this.drawSize);
                    }else{
                        ctx.fillStyle = this.deadColor;
                        ctx.fillRect(x, y, this.drawSize, this.drawSize);
                    }
                //}
                x += this.cellSize;
                nx++;
            });
            y += this.cellSize;
            ny++;
            x = 0;
            nx=0;
        });
    }

    drawOne(ctx, x, y) {
        ctx.fillStyle = this.matrix[y][x] ? this.aliveColor : this.deadColor;

        x *= this.cellSize;
        y *= this.cellSize;

        ctx.fillRect(x, y, this.drawSize, this.drawSize);
    }

    aliveAround(line, col){
        let aliveAround = 0;
        for(let i=-1; i <= 1; i++){
            for(let j=-1; j <= 1; j++){
                if(!(i==0 && j==0)){ //est fait 9x
                    let x=null;
                    let y=null;
                    let outsideGrid = false;

                    if(this.flatTorus){
                        if(line+i<0) x=this.matrix.length - 1;
                        else if(line+i > this.matrix.length -1) x=0;
                        else x = line+i;
                        if(col+j<0) y=(this.matrix[0].length) -1;
                        else if(col+j > this.matrix[0].length -1) y=0;
                        else y = col+j;
                    }else {
                        if(line+i<0 || line+i > this.matrix.length -1) outsideGrid = true;
                        else x = line+i;
                        if(col+j<0 || col+j > this.matrix[0].length -1) outsideGrid = true;
                        else y = col+j;
                    }               

                    if(!outsideGrid && this.matrix[x][y]) aliveAround++;
                }
            }
        }
        return aliveAround;
    }

    makeLife(bRule, sRule){
        let tempMatrix = [];
        this.matrix.forEach((row, x) => {
            tempMatrix[x] = [];
            row.forEach((col, y) => {
                if(this.matrix[x][y]){    //Si la cellule est vivante
                    tempMatrix[x][y] = sRule[this.aliveAround(x, y)];
                }else{                    //Si la cellule est morte
                    tempMatrix[x][y] = bRule[this.aliveAround(x, y)];
                }
            });
        });
        this.oldMatrix = this.matrix;
        this.matrix = tempMatrix;
    }

    toggleMapType() {
        this.flatTorus ^= true;
    }

    toggleCell(ctx, x, y) {
        this.matrix[y][x] ^= true
        this.drawOne(ctx, x, y)
    }

    getCellSize() {
        return this.cellSize;
    }
}