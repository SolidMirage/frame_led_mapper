var CTX;

var CONFIG = {
    "animation_timing_ms": 80,
    "none_color": "#000000",
    "label_color": "#aaaaaa",
    "label_font": "10px Arial bold",
    "grid_height": 12,
    "grid_length": 12,
    "led_size": 15,
    "led_spacing": 3,
    "blur_size": 150,
    "num_strands": 4,
    "image_width": 400,
    "image_height": 400
}

var animation; 
var playing = false;
var insertAtTheEnd = false;
var colorPicking = false;
var blurPixel = false;
var showImage = true;
var showHalf = false;
/* pencil, eraser */
var mode = "pencil";

var imageSelected;
var imageOverlay = new Image();
imageOverlay.onload=function(){
    CTX.drawImage(imageOverlay,-10,-10,CONFIG["image_width"],CONFIG["image_height"]);
    animation.draw();
}
var imageOverlayAlpha = 1;

var showLEDImage = true;
var LEDImageSelected;
var LEDImageOverlay = new Image();
LEDImageOverlay.onload=function(){
    CTX.drawImage(LEDImageOverlay,-10,-10,CONFIG["image_width"],CONFIG["image_height"]);
    animation.draw();
}
var LEDImageOverlayAlpha = 1;
// var activeStrand = undefined;

function selectImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            imageSelected = e.target.result;
            imageOverlay.src = imageSelected;
            // console.log(e.target.result);
                if(showImage){
                    CTX.globalAlpha=imageOverlayAlpha;
                    CTX.globalCompositeOperation = "source-over";
                    CTX.drawImage(imageOverlay,-10,-10,CONFIG["image_width"],CONFIG["image_height"]);
                    CTX.globalCompositeOperation = "screen";
                    CTX.globalAlpha=1;
                }
        }
        reader.readAsDataURL(input.files[0]);
    }
    animation.draw();
}

function selectLEDImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            LEDImageSelected = e.target.result;
            LEDImageOverlay.src = LEDImageSelected;
            // console.log(e.target.result);
                if(showLEDImage){
                    CTX.globalAlpha=LEDImageOverlayAlpha;
                    CTX.globalCompositeOperation = "source-over";
                    CTX.drawImage(LEDImageOverlay,-10,-10,CONFIG["image_width"],CONFIG["image_height"]);
                    CTX.globalCompositeOperation = "screen";
                    CTX.globalAlpha=1;
                }
        }
        reader.readAsDataURL(input.files[0]);
    }
    animation.draw();
}

/* This funciton is stolen from: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Written by Tim Down */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function writeUint8(value, array) 
{
        let steps = new Uint8Array(1);
        steps[0] = value;
        array.push(steps);
}

function writeUint16(value, array) 
{
        let steps = new Uint16Array(1);
        steps[0] = value;
        array.push(steps);
}

function clearCanvas() 
{
    CTX.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCurrentStep() 
{
    $(".totalSteps").each(function() {
        this.innerHTML = animation.stepCount + 1;
    })
}

function updateTotalSteps() 
{
    $(".currentStep").each(function() {
        this.innerHTML = animation.currentIndex + 1;
    })
}

function initializeStrands(){
    let strands = []
    for(let i = 0; i < CONFIG['num_strands']; i++){
        // convert number into letter
        // https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter
        let newStrand = new Strand((i+10).toString(36).toUpperCase(),[]);
        strands.push(newStrand);
    }
    return strands;
}
function startDraw()
{
    var mouse_down = false;
    var c = document.getElementById("canvas");
    CTX = c.getContext("2d");
    
    CTX.globalCompositeOperation = "screen";
    
    var height = 12;
    var strands = initializeStrands();

    animation = new Animation(strands);
    animation.draw();
    

    c.onclick = function(e) 
    {
        // let node = {
        //     x: e.offsetX,
        //     y: e.offsetY,
        //     radius: 10,
        //     fillStyle: '#22cccc',
        //     strokeStyle: '#009999',
        //     number: animation.leds.length,
        //     selected: false
        // }
        // animation.leds.push(node)
        // animation.draw();
        // // if (animation.clickLed(e.offsetX, e.offsetY) ) 
        // // {
        // //     animation.draw();
        // // }
    }

    c.onmousedown = function(e)
    {
        let target = animation.within(e.offsetX, e.offsetY);
        console.log('animation target: ' + target);
        if(!target){
            animation.selectedLED = undefined;
        }
        else{
            animation.selectedLED = target;
            // if(mode != 'pencil'){
            //     animation.selectedLED.fillStyle = '#2222FF';
            //     animation.draw();
            // }
        }
        // debugger;


        // if(mode == 'strand-eraser' || mode == 'strand-move'){
            
        //     if(animation.selectedLED && animation.selectedLED.selected){
        //         animation.selectedLED.selected = false;
        //     }
        //     if(target){
        //         animation.selectedLED = target;
        //         animation.selectedLED.fillStyle='#2222FF';
        //         // animation.selectedLED.selected = true;
        //         animation.draw();
        //     }
        // }
        
        // mouse_down = true;
    }

    c.onmousemove = function(e)
    {
        if(mode == 'strand-eraser'){
            if(animation.within(e.offsetX, e.offsetY) != animation.selectedLED){
                animation.deselectLED();
            }
        }
        else if(animation.selectedLED && e.buttons && (mode == 'strand-add' || mode == 'strand-move')){
            animation.selectedLED.x = e.offsetX;
            animation.selectedLED.y = e.offsetY;
            // animation.selectedLED.moving = true;
            animation.draw();
        }
        // if (mouse_down) 
        // {
        //     if (animation.clickLed(e.offsetX, e.offsetY) ) 
        //     {
        //         clearCanvas()
        //         animation.draw();
        //     }
        // }
    }
    c.onmouseup = function(e) 
    {
        if(mode =='strand-eraser'){
            if(animation.selectedLED){
                animation.removeLED();
            }
        }
        if(mode =='strand-add'){
            if(!animation.selectedLED){
                let newLED = new Led(e.offsetX,
                                    e.offsetY,
                                    animation.activeStrand.name,
                                    animation.activeStrand.leds.length,
                                    animation.use_color);
                // let node = {
                //         x: e.offsetX,
                //         y: e.offsetY,
                //         radius: 10,
                //         fillStyle: '#22cccc',
                //         strokeStyle: '#009999',
                //         number: animation.leds.length,
                //         selected: false,
                //         moving: false
                //     }
                animation.addLED(newLED)
            }
        }

        if(mode == 'pencil'){
            animation.updateLEDColor();
            animation.draw();
        }

        if(mode=='eraser'){
            animation.use_color = CONFIG["none_color"];
            animation.updateLEDColor();
            animation.draw();
        }

        if(mode == 'eyedropper'){
            var colorPickery = document.getElementById('colorPicker');
            console.log(animation.selectedLED.getColor());
            setColor(animation.selectedLED.getColor());
            colorPickery.jscolor.fromString(animation.selectedLED.getColor());
            // animation.user_color = animation.selectedLED.getColor();
        }

        if(animation.selectedLED && !animation.selectedLED.selected){
            animation.deselectLED();
        }
        
        
        animation.draw();
        // mouse_down = false;
    }
}

function stepForward() 
{
    animation.stepForward();
}

function stepBackward() 
{
    animation.stepBackward();
}

function play() 
{
    animation.play();
}

function stop()
{
    animation.stop();
}

function setColor(color) 
{
    animation.setColor(color);
}

function setColorPicker(color){
    setMode("pencil");
    setColor(color);
    // console.log("color"+ color);
}

function setMode(m, strand=undefined) 
{
    colorPicking = false;
    mode = m
    if (mode == "pencil") {
        // color from javascript color picker
        var colorPickery = document.getElementById('colorPicker');
        setColor(colorPickery.jscolor);
        // setColor()
        $('#canvas').css({'cursor': "url('assets/pencilsmall.png') -10 40, pointer"});
    }
    else if (mode == "eraser") {
        setColor(CONFIG["none_color"])
        $('#canvas').css({'cursor': "url('assets/erasersmall.png') -10 40, pointer"});
    }
    else if (mode == "strand-eraser"){
        $('#canvas').css({'cursor': "no-drop"});
    }
    else if (mode == "strand-add"){
        $('#canvas').css({'cursor': "cell"});
    }
    else if (mode == "strand-move"){
        $('#canvas').css({'cursor': "all-scroll"});
    }
    else if(mode == "eyedropper"){
        $('#canvas').css({'cursor': "url('assets/eyedropper.png') -10 40, pointer"});
    }
    if(strand){
        animation.selectStrand(strand)
    }
    else{
        animation.deselectStrand();
    }
}

function clearAll() {
    animation.clearAll()
}

function exportFormat() {
    animation.export();
}

function toggleBlur(){
    blurPixel = !blurPixel;
    animation.draw();
}

function toggleImage(){
    showImage = !showImage;
    animation.draw();
}

function toggleLEDImage(){
    showLEDImage = !showLEDImage;
    animation.draw();
}

function toggleHalf(){
    showHalf = !showHalf;
    animation.draw();
}

function toggleImageOpacity(){
    imageOverlayAlpha = imageOverlayAlpha === 1 ? 0.5: 1;
    animation.draw();
}

function toggleLEDImageOpacity(){
    LEDImageOverlayAlpha = LEDImageOverlayAlpha === 1 ? 0.5: 1;
    animation.draw();
}

function exportMap(){
    animation.exportMap();
}

function saveToJsonFile() {
    animation.saveToJsonFile();
}

function loadFromJsonFile(jsonString) {
    return animation.loadFromJsonFile(jsonString);
}

function removeStep() {
    animation.deleteStep();
}

function newStep() {
    animation.newStep();
}

function copyStep() {
    animation.newStep(true)
}

function insertAfter(v){
    insertAtTheEnd = v;
}

// function colorPick(v) {
//     colorPicking = v;
//     if (colorPicking) {
//         $('#canvas').css({'cursor': "url('assets/eyedropper.png') -10 40, pointer"});
//     }
//     else {
//         setMode(mode);
//     }
// }

function readFile(file) {     
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const result = event.target.result;
        var loadResult = loadFromJsonFile(result);
        const output = document.getElementById('output');
        const li = document.createElement('li');
        if (loadResult){
            li.textContent = `Loaded animation file!`;
            output.appendChild(li);
        }
        else{
            li.textContent = `Failed to load backup animation file :(  Was it a .json file?`;
            output.appendChild(li);
        }
    });
    reader.readAsText(file);
}

function attachFileLoaderHandler(){
    const output = document.getElementById('output');
    if (window.FileList && window.File) {
        document.getElementById('file-selector').addEventListener('change', event => {
            output.innerHTML = '';
            for (const file of event.target.files) {
                const li = document.createElement('li');
                const name = file.name ? file.name : 'NOT SUPPORTED';
                //const type = file.type ? file.type : 'NOT SUPPORTED';
                const size = file.size ? file.size : 'NOT SUPPORTED';
                li.textContent = `File name: ${name}, size: ${size}`;
                output.appendChild(li);
                readFile(file);
            }
        }); 
    }
}
