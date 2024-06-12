class Strand 
{
    constructor(name, leds) 
    {
        this.name = name;
        this.leds = leds;
    }

    removeLED(led){
        for(let i = led.number; i < this.leds.length-1; i++){
            this.leds[i] = this.leds[i+1];
            this.leds[i].number = i;
        }
        this.leds.pop();
    }

    draw(){
        this.drawEdges();
        this.leds.forEach(led=>{
            led.draw();
        });
    }

    insertStep(){
        this.leds.forEach(led => {
            led.insert();
        });
    }

    copyIndex(previousIndex){
        this.leds.forEach(led => {
            led.copyIndex(previousIndex);
        });
    }

    updateState(step){
        this.leds.forEach(led => {
            led.updateState(step)
        });
    }

    deleteStep(step){
        this.leds.forEach(led => {
            led.removeStep(step);
            led.updateState(step-1);
         });
    }

    drawEdge(fromNode, toNode){
        CTX.beginPath();
        CTX.strokeStyle = fromNode.strokeStyle;
        CTX.moveTo(fromNode.x, fromNode.y);
        CTX.lineTo(toNode.x, toNode.y);
        CTX.stroke();
    }

    drawEdges(){
        if(this.leds.length < 2){
            return;
        }
        // let fromNode = leds[0];
        // let toNode = leds[1];
        // this.drawEdge(fromNode, toNode);
        for(let i = 1; i < this.leds.length; i++){
            let fromNode = this.leds[i-1];
            let toNode = this.leds[i];
            this.drawEdge(fromNode, toNode);
        }
    }

    within(x,y){
        return this.leds.find(led=>{
            return x > (led.x - led.size) &&
                y > (led.y - led.size) &&
                x < (led.x + led.size) &&
                y < (led.y + led.size)
        });
    }
}