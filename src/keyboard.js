class Keyboard{
    constructor(){
        this.keyMap = {
            '1' : 0x0,
            '2' : 0x1,
            '3' : 0x2,
            '4' : 0x3,
            'q' : 0x4,
            'w' : 0x5,
            'e' : 0x6,
            'r' : 0x7,
            'a' : 0x8,
            's' : 0x9,
            'd' : 0xA,
            'f' : 0xB,
            'z' : 0xC,
            'x' : 0xD,
            'c' : 0xE,
            'v' : 0xF,
        }
        this.keysPressed = {};
        window.addEventListener('keydown',  this.onKeyDown.bind(this));
        window.addEventListener( 'keyup',   this.onKeyUp.bind(this));
    }

    onKeyDown(e){
        if( this.keyMap[e.key] )
            this.keysPressed[this.keyMap[e.key]] = true;
    }
    onKeyUp(e){
        if( this.keyMap[e.key] )
            this.keysPressed[this.keyMap[e.key]] = false;
    }
    isKeyPressed(keyCode){
        return this.keysPressed[keyCode];
    }

}

export default Keyboard;
