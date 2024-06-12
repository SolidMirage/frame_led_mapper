class Animation 
{
    constructor(strands)
    {
        this.strands = strands;
        this.stepCount = 0;
        this.currentIndex = 0;
        this.playing = false;
        this.use_color = "#ffffff"
        this.colors = [{}]
        this.selectedLED = undefined;
        this.activeStrand = undefined;
    }

    clickLed(x, y) 
    {
        // for (let i = 0; i < CONFIG["grid_height"] * CONFIG["grid_length"]; i++) {
        //     if (this.leds[i].checkCollision(x, y)) {
        //         if (colorPicking) {
        //             let color = this.leds[i].getColor()
        //             if (color != CONFIG["none_color"]) {
        //                 this.setColor(color.substr(1));
        //                 document.getElementById("colorpicker").jscolor.fromString(color);
        //             }
        //         }
        //         else if (mode == "pencil") {
        //                 this.leds[i].updateColor(this.use_color);
        //                 this.colors[this.currentIndex][this.use_color] = 1;
        //         }

        //         else if (mode == "eraser")
        //                 this.leds[i].updateColor(CONFIG["none_color"]);

        //         return true;
        //     }
        // }
        // return false;
        return true;
    }

    getLedsWithColor(index, color) 
    {
        debugger;
        var led_indexes = []
        this.leds.forEach(led => {
            if (led.hasColorInState(index, color)) 
            {
                led_indexes.push(led.getIndex());
            }
        });
        return led_indexes;
    }

    /* Data format:
    uint8: total animation steps
    ---
    uin16: numbers of colors in this step,
    ----
    uint8: r,
    uint8: g,
    uint8: b,
    uint16: number of leds in this step
    uint16 led_indexes[] 
    ---
    uint16: number of colors in this step
    -----
    uint8 r,
    uint8 g.... and so on
    */
    
    export() {
        let data = [];
        let totalAnimationSteps = this.stepCount + 1;

        // define number of frames and number of LEDS
        data.push(`#define NUM_FRAMES ${totalAnimationSteps}\n`);
        // NUM_LEDS_A, NUM_LEDS_B, etc
        this.strands.forEach((strand)=>{
            data.push(`#define NUM_LEDS_${strand.name} ${strand.leds.length}\n`);
        });
        

        // make arrays for each of the strands
        this.strands.forEach((strand)=>{
            let arrStr = `const uint32_t frames${strand.name}[NUM_FRAMES][NUM_LEDS_${strand.name}] = {`;
            for (var frame = 0; frame < totalAnimationSteps; frame++) 
            {
                let currFrame = []
                strand.leds.forEach(elem=>{
                    // currFrame.push(elem.colorState[frame].replace("#","0x"));
                    currFrame.push(this.exportColorGamma(elem.colorState[frame]));
                });
                arrStr += "{" + currFrame.toString() + "},\n";            
            }
            arrStr += `};\n`;
            data.push(arrStr);
        });
        

        var blob = new Blob(data, { type: "text/plain" });
        var blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl,'_blank').focus();

        var fileLink = document.createElement('a');
        fileLink.href = blobUrl
        var fileTextInput = document.getElementById('saveFileNameInput');
        fileLink.download = fileTextInput.value + "_animation.txt"
        fileLink.click();
    }

    // convert the r g b values to the gamma corrected ones for better 
    // color reproduction on the frame
    exportColorGamma(color){
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
        //   debugger;
          let red = gamma8[parseInt(color.substring(1,3),16)];
          let green = gamma8[parseInt(color.substring(3,5),16)];
          let blue = gamma8[parseInt(color.substring(5,7),16)];

          return '0x'+red.toString(16).padStart(2,'0') + green.toString(16).padStart(2,'0') + blue.toString(16).padStart(2,'0');
        // return color.replace("#","0x");


    }

    exportMap(){
        let data = [];

        data.push(`#define IMAGE_WIDTH ${CONFIG["image_width"]}\n`);
        data.push(`#define IMAGE_HEIGHT ${CONFIG["image_height"]}\n`);
        data.push(`#define NUM_STRANDS ${this.strands.filter((strand) => strand.leds.length > 0).length}\n`);
        // NUM_LEDS_A, NUM_LEDS_B, etc
        this.strands.forEach((strand)=>{
            if(strand.leds.length > 0){
                data.push(`#define NUM_LEDS_${strand.name} ${strand.leds.length}\n`);
            }
        });
        
        // make arrays for each of the strands
        this.strands.forEach((strand)=>{
            if(strand.leds.length > 0){
                let arrStr = `const uint8_t LED${strand.name}_X[NUM_LEDS_${strand.name}] = {`;
                strand.leds.forEach(elem=>{
                    arrStr += elem.x + ",";
                });
                // remove comma at end
                arrStr = arrStr.replace(/,$/,"");
                arrStr += `};\n`;
                data.push(arrStr);
            }
        });

        this.strands.forEach((strand)=>{
            if(strand.leds.length > 0){
                let arrStr = `const uint8_t LED${strand.name}_Y[NUM_LEDS_${strand.name}] = {`;
                strand.leds.forEach(elem=>{
                    arrStr += elem.y + ",";
                });
                // remove last comma
                arrStr = arrStr.replace(/,$/,"");
                arrStr += `};\n`;
                data.push(arrStr);
            }
        });
        

        var blob = new Blob(data, { type: "text/plain" });
        var blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl,'_blank').focus();

        var fileLink = document.createElement('a');
        fileLink.href = blobUrl
        var fileTextInput = document.getElementById('saveFileNameInput');
        fileLink.download = fileTextInput.value + "_map.txt"
        fileLink.click();
    }

    saveToJsonFile()
    {
        let data = {};
        data.strands = this.strands;
        // data.leds = this.strands[0].leds;
        data.stepCount = this.stepCount;
        data.currentIndex = this.currentIndex;
        // data.colors = this.colors;
        data.use_color = this.use_color;
        console.log(data);
        const dataJson = JSON.stringify(data);
        var blob = new Blob([dataJson], { type: "application/octet-stream" });
        var blobUrl = URL.createObjectURL(blob);
        // window.location.replace(blobUrl);

        var fileLink = document.createElement('a');
        fileLink.href = blobUrl
        var fileTextInput = document.getElementById('saveFileNameInput');
        fileLink.download = fileTextInput.value + "_animation.json"
        fileLink.click();
    }

    loadFromJsonFile(jsonString)
    {
        this.playing = false;
        var data = null;
        try {
            data = JSON.parse(jsonString);
        } catch(e) {
           return false;
        }
        if (!data){
            return false;
        }
        clearAll();
        var newStrands = [];
        // remake the strands
        data.strands.forEach((strand)=>{
            // remake LEDs
            var newLeds = [];
            strand.leds.forEach((led)=>{
                var newLed = new Led(led.x, led.y,led.strandName,led.number);
                newLed.colorState = led.colorState;
                newLed.currentState = led.currentState;
                newLed.size = led.size;
                // newLed.spacing = led.spacing;
                // newLed.posX = led.posX;
                // newLed.posY = led.posY;
                // newLed.strandName = led.strandName;
                newLeds.push(newLed);
            })
            var newStrand = new Strand(strand.name,newLeds);
            newStrands.push(newStrand);
        })
        // data.leds.forEach(led => {
            
        // });


        // this.strands[0].leds = newLeds;
        this.strands = newStrands;
        this.stepCount = data.stepCount;
        this.currentIndex = data.currentIndex;
        // this.colors = data.colors;
        this.use_color = data.use_color;
        this.currentState = 0
        this.update();

        this.setColor(data.use_color.substr(1));
        document.getElementById("colorPicker").jscolor.fromString(data.use_color);
        return true;
    }

    update() 
    {
        this.updateLedState();
        this.draw();
    }
    
    insertStep() 
    {
        this.strands.forEach(strand => {
            strand.insertStep();
        });
    }
    newStep(copy = false) 
    {
        this.stepCount++;
        var previousIndex = this.currentIndex;
        if (insertAtTheEnd) {
            this.currentIndex = this.stepCount;
            this.colors.push({});
        } else {
            this.currentIndex++;
            this.colors.splice(this.currentIndex, 0, {});
            this.insertStep();
        }

        this.update();

        if (copy && this.stepCount > 0) 
        {
            for (const color of Object.keys(this.colors[previousIndex])) 
            {
                this.colors[this.currentIndex][color] = 1;
            }

            this.strands.forEach(strand => {
                strand.copyIndex(previousIndex);
            });
        }
        this.update();
    }

    stepForward() 
    {
        if (this.currentIndex < this.stepCount) {
            this.currentIndex++;
        }
        else {
            this.currentIndex = 0;
        }
        this.update();
    }
    
    clearAll() 
    {
        // this.strands = [];
        this.strands.forEach((strand)=>{
            strand.leds.forEach(led=>{
                led.updateColor(CONFIG["none_color"])
            })
        })
        // this.strands[0].leds.forEach(led => {
        //     led.updateColor(CONFIG["none_color"]);
        // });
        // this.update();
    }
    stepBackward() 
    {
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.stepCount;
        this.update();
    }

    updateLedState() 
    {
        this.strands.forEach(strand => {
            strand.updateState(this.currentIndex)
        });
    }

    animationStep() 
    {

        if (this.stepCount == 0) 
        {
            this.stop();
            return;
        }
        this.currentIndex++;
        this.currentIndex = (this.currentIndex % (this.stepCount + 1))
        this.update();
    }
    
    setColor(color)
    {
        this.use_color = "#" + color;
    }

    play() 
    {
        if (!playing) {
            playing = true;
            this.playingInterval = setInterval(() => {this.animationStep()}, CONFIG["animation_timing_ms"]);
        }
    }
     
    stop() 
    {
        playing = false;
        clearTimeout(this.playingInterval);
        this.update();
    }
    
    deleteStep() 
    {
     if (this.stepCount > 0)   {
         this.strands.forEach(strand => {
            strand.deleteStep(this.currentIndex);
            // led.removeStep(this.currentIndex);
            // led.updateState(this.currentIndex - 1);
         });
         this.colors.splice(this.currentIndex, 1);
         if (this.currentIndex != 0)
            this.currentIndex--;
         this.stepCount--;
         this.update();
     }
    }

    

    // drawEdges(){
    //     this.strands.forEach(strand=>{
    //         strand.drawEdges();
    //     });
    // }

    drawStrands(){
        this.strands.forEach(strand=>{
            strand.draw();
        })
    }
    
    draw() 
    {
        clearCanvas()
        updateCurrentStep()
        updateTotalSteps()
        if(showLEDImage && LEDImageOverlay.src){
            CTX.globalAlpha=LEDImageOverlayAlpha;
            CTX.globalCompositeOperation = "source-over";
            LEDImageOverlay.src = LEDImageSelected;
            CTX.drawImage(LEDImageOverlay,-10,-10,400,400);
            CTX.globalCompositeOperation = "screen";
            CTX.globalAlpha=1;
        }
        // this.drawEdges();
        this.drawStrands();
        // this.leds.forEach(led=>{
        //     led.draw();
        // });
        // this.leds.forEach(led=>{
        //     CTX.beginPath();
        //     CTX.fillStyle = led.fillStyle;
        //     CTX.arc(led.x, led.y, led.radius, 0, Math.PI*2, true);
        //     CTX.strokeStyle = led.strokeStyle;
        //     CTX.stroke();
        //     CTX.fill();

        //     CTX.font = '30px Arial bold';
        //     CTX.fillStyle = '#ff0000';
        //     CTX.fillText(led.number,led.x-(led.radius/2), led.y+(led.radius/2));
        // })

        // this.leds.forEach(led => {
        //    led.draw(); 
        // });
        if(showImage && imageOverlay.src){
            CTX.globalAlpha=imageOverlayAlpha;
            CTX.globalCompositeOperation = "source-over";
            imageOverlay.src = imageSelected;
            CTX.drawImage(imageOverlay,-10,-10,400,400);
            CTX.globalCompositeOperation = "screen";
            CTX.globalAlpha=1;
        }

        
        
    }

    within(x,y){
        for(let i = 0; i < this.strands.length; i++){
            let findLED = this.strands[i].within(x,y);
            if(findLED){
                return findLED;
            }
        }
        return undefined;
        // return strand.within(x,y);
        // return this.strands.find(strand=>{
        //     console.log("strand " + strand.name + ", " +strand.within(x,y));
        //     strand.within(x,y);
        // })
        // return this.leds.find(led=>{
        //     return x > (led.x - led.size) &&
        //         y > (led.y - led.size) &&
        //         x < (led.x + led.size) &&
        //         y < (led.y + led.size)
        // });
    }

    addLED(led){
        // led is a new LED with proper position, strandname, index
        // If added when there are more than one frame, then the rest of the
        // frames (colorstates) need to be filled with a blank color.
        // current frame can be the active color
        // debugger;
        var newColorState = Array(this.stepCount+1).fill(CONFIG["none_color"]);
        newColorState[this.currentIndex] = this.use_color;
        led.colorState = newColorState;
        animation.activeStrand.leds.push(led);
        this.update();
    }

    removeLED(){
        // if(this.leds.length == 1){
        //     this.leds.pop();
        // }
        // renumber everything after
        // let strand = this.strands.find(strand=>{
            // strand.name == this.selectedLED.strand;
        // })

        var selectedLEDStrand = this.strands.find(strand=>
            strand.name == this.selectedLED.strandName
        );
        selectedLEDStrand.removeLED(this.selectedLED);
        // this.selectedLED.strand.removeLED(this.selectedLED);
        // debugger;

        // strand.removeLED(this.selectedLED);
        // for(let i = this.selectedLED.number; i < this.leds.length-1; i++){
        //     this.leds[i] = this.leds[i+1];
        //     this.leds[i].number = i;
        // }
        // this.leds.pop();
        this.selectedLED = undefined;
    }

    deselectLED(){
        if(this.selectedLED){
            // this.selectedLED.fillStyle='#22cccc';
            this.selectedLED = undefined;
        }
    }

    updateLEDColor(){
        // debugger;
        if(this.selectedLED){
            this.selectedLED.updateColor(this.use_color);
        }
    }

    selectStrand(strandName){
        this.activeStrand = this.strands.find(strand=>strand.name == strandName);
    }
    
    deselectStrand(){
        this.activeStrand = undefined;
    }
}