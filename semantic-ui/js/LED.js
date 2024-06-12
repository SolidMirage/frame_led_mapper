class Led 
{
    constructor(x, y, s, n, c = CONFIG["none_color"]) 
    {
        this.x = x;
        this.y = y;
        this.colorState = [c]
        this.currentState = 0;
        this.strandName = s;
        
        this.number = n;
        this.size = CONFIG["led_size"];
        
        // this.radius = 10;
        // this.spacing = CONFIG["led_spacing"]
        // this.posX = this.x * this.size + this.x * this.spacing;
        // this.posY = this.y * this.size + this.y * this.spacing;
        // this.posX = this.x * this.size;
        // this.posY = this.y * this.size;
    }

    removeStep(idx) {
        this.colorState.splice(idx, 1)
    }
    hasColorInState(state, color) {
        return this.colorState[state] == color;
    }

    getColor() 
    {
        return this.colorState[this.currentState];
    }

    getIndex()
    {
        return this.y * CONFIG["grid_length"] + this.x;
    }

    insert() {
        this.colorState.splice(this.currentState + 1, 0,  CONFIG["none_color"]);
    }

    copyIndex(idx) 
    {
        this.colorState[this.currentState] = this.colorState[idx];
    }

    checkCollision(x, y) 
    {
        return (x >= this.posX && x <= this.posX + this.size && y >= this.posY && y <= this.posY + this.size)
    }

    updateColor(color) 
    {
        this.colorState[this.currentState] = color;
        // this.reduceColor();
    }

    updateState(step) 
    {
        this.currentState = step;
        if (step == this.colorState.length) {
            this.colorState.push(CONFIG["none_color"])
        }
    }

    draw() 
    {
        // CTX.beginPath();
        // // debugger;
        // CTX.fillStyle = this.colorState[this.currentState];
        // CTX.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
        // // CTX.strokeStyle = this.strokeStyle;
        // CTX.stroke();
        // CTX.fill();

        // CTX.font = '30px Arial bold';
        // CTX.fillStyle = '#aaaaaa';
        // // CTX.fillText(this.number,this.x-(this.size/2), this.y+(this.size/2));
        // CTX.fillText(this.number,this.x+this.size, this.y-this.size);





        // if(showHalf && (this.x + this.y) % 2 === 0){
        //     return;
        // }
        // var prevState = this.currentState - 1;
        // if(prevState < 0){
        //     prevState = this.colorState.length - 1;
        // }
        // if (this.colorState[prevState] != CONFIG["none_color"] && this.colorState[this.currentState] == CONFIG["none_color"] && !playing) {
        //     // var b1 = this.currentState -1;
        //     // var b2 = b1 % this.colorState.length;
        //     // var foo = this.colorState[b1];
        //     // debugger;
        //     CTX.fillStyle = this.colorState[prevState];
        //     // if(this.currentState === 0){
        //     //     CTX.fillStyle = this.colorState[animation.stepCount - 1];
        //     // }
        //     // else{
        //     //     CTX.fillStyle = this.colorState[this.currentState - 1];
        //     // }
        //     CTX.globalAlpha = 0.3;
        //     CTX.shadowBlur = 0;
        // }

        // else {
        //     CTX.fillStyle = this.colorState[this.currentState];
        //     CTX.shadowColor = this.colorState[this.currentState];
        //     CTX.globalAlpha = 1;
        //     CTX.shadowBlur = 0;
        // }





        if(blurPixel){
            // debugger;
            var blurCircX = this.x;
            var blurCircY = this.y;
            var blurRectX = blurCircX - CONFIG["blur_size"]/2;
            var blurRectY = blurCircY - CONFIG["blur_size"]/2;
            var radgrad = CTX.createRadialGradient(blurCircX, blurCircY,0,
                                                    blurCircX,blurCircY,CONFIG["blur_size"]/2);

            radgrad.addColorStop(0, this.colorState[this.currentState]+'ff');
            radgrad.addColorStop(.8, this.colorState[this.currentState]+'00');
            
            CTX.fillStyle = radgrad;
            CTX.fillRect(blurRectX, blurRectY, CONFIG["blur_size"], CONFIG["blur_size"]);
            CTX.stroke();
        } else{
            CTX.beginPath();
            // debugger;
            CTX.fillStyle = this.colorState[this.currentState];
            CTX.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
            CTX.stroke();
            CTX.fill();

            CTX.font = CONFIG['label_font'];
            CTX.fillStyle = CONFIG["label_color"];
            CTX.fillText(this.colorState[this.currentState],this.x-(this.size/2), this.y);
            CTX.fillText(this.strandName+this.number,this.x-(this.size/2), this.y+(this.size/2));
            // CTX.fillText(this.strandName + this.number,this.x+this.size, this.y-this.size);
        }
        
    }

    reduceColor(col){
        // console.log('start:'+this.colorState[this.currentState])
        // let red = Math.floor(parseInt(col.substring(1,3),16) / 2).toString(16).padStart(2,'0');
        // let green = Math.floor(parseInt(col.substring(3,5),16) / 2).toString(16).padStart(2,'0');
        // let blue = Math.floor(parseInt(col.substring(5,7),16) / 2).toString(16).padStart(2,'0');
        // console.log('end:'+'red:' + red + ', green: ' + green + ", blue:" + blue);
        let gamma8 = [
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
            1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
            2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
            5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
           10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
           17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
           25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
           37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
           51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
           69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
           90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
          115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
          144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
          177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
          215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255 ];

        let red = gamma8[parseInt(col.substring(1,3),16)].toString(16).padStart(2,'0');
        let green = gamma8[parseInt(col.substring(3,5),16)].toString(16).padStart(2,'0');
        let blue = gamma8[parseInt(col.substring(5,7),16)].toString(16).padStart(2,'0');


        return "#"+ red + green+blue;
        // console.log('end:'+this.colorState[this.currentState])
    }
}