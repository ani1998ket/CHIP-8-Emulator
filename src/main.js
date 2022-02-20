import Renderer from "./renderer.js";
import Keyboard from "./keyboard.js";
import Speaker from "./speaker.js";
import CPU from "./cpu.js";

const renderer = new Renderer(10);
const speaker = new Speaker();
const keyboard = new Keyboard();
const cpu = new CPU( renderer, keyboard, speaker );

const fps = 60;
let currentTime, lastTime, elapsedTime;
let loop;

function init(){
    lastTime = Date.now();
    cpu.loadRom("BLINKY.ch8");
    loop = window.requestAnimationFrame( step );
    speaker.play(440);
}

function step(){
    currentTime = Date.now();
    elapsedTime = currentTime - lastTime;
    let desiredInterval = 1000 / fps;

    if( elapsedTime > desiredInterval){
        cpu.tick();
        lastTime = currentTime;
    }
    loop = window.requestAnimationFrame( step );
}
window.setTimeout(()=>{
    speaker.stop();
}, 2000);
init();