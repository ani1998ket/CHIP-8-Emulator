import Renderer from "./renderer.js";
import Keyboard from "./keyboard.js";
import Speaker from "./speaker.js";
import CPU from "./cpu.js";

const renderer = new Renderer(10);
const speaker = new Speaker();
const keyboard = new Keyboard();
const cpu = new CPU( renderer,speaker, keyboard );

const fps = 60;
let currentTime, lastTime, elapsedTime;
let loop;

function init(){
    lastTime = Date.now();
    cpu.loadRom("test1.ch8");
    loop = window.requestAnimationFrame( step );
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

init();