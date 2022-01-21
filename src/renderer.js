class Renderer{
    constructor(scale){
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.scale = 10;
        this.cols = 64;
        this.rows = 32;
        this.backgroundColor = "#999DA0"
        this.fillColor = "#48494B"

        this.canvas.width = this.cols * scale;
        this.canvas.height = this.rows * scale;

        this.buffer = new Array( this.rows * this.cols );
    }

    setPixel(x,y){
        x = (( x % this.cols ) + this.cols) % this.cols;
        y = (( y % this.rows ) + this.rows) % this.rows;
        let index = y*this.cols + x;
        this.buffer[index] ^= 1;
        return !this.buffer[index];
    }

    render(){
        this.ctx.fillStyle = "#999DA0FF";
        this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        this.ctx.fillStyle = this.fillColor;
        for( let i = 0; i < this.buffer.length; i++ ){
            if( this.buffer[i] ){
                let x = (i % this.cols) * this.scale;
                let y = Math.floor(i / this.cols) * this.scale;
                this.ctx.fillRect(x,y,this.scale,this.scale);
            }
        }
    }
    
    clear(){
        this.buffer = new Array( this.rows * this.cols );
    }

    test(){
        for( let i = 0; i < this.cols; i++ ){
            this.setPixel(i, i);
            this.setPixel(i, this.rows - i - 1);
            this.setPixel(i, this.rows/2)
        }
    }
}
export default Renderer;