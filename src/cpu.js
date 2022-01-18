class CPU{
    constructor( renderer, keyboard, speaker ){
        this.RAM = new Uint8Array( 4096 );
        this.V = new Uint8Array( 16 );
        this.I = null;
        this.PC = 0;
        this.stack = [];

        this.delayTimer = 0;
        this.soundTimer = 0;

        this.renderer = renderer;
        this.keyboard = keyboard;
        this.speaker = speaker;

        this.speed = 10;
    }

    loadFonts(){
        let fontSprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];

        for( let i = 0; i < fontSprites.length; i++ ){
            this.RAM[i] = fontSprites[i];
        }
    }

    loadRom(romName) {
        var request = new XMLHttpRequest;
        var self = this;
    
        // Handles the response received from sending (request.send()) our request
        request.onload = function() {
            // If the request response has content
            if (request.response) {
                // Store the contents of the response in an 8-bit array
                let program = new Uint8Array(request.response);
    
                // Load the ROM/program into memory
                self.loadProgram(program);
            }
        }
    
        // Initialize a GET request to retrieve the ROM from our roms folder
        request.open('GET', 'roms/' + romName);
        request.responseType = 'arraybuffer';
    
        // Send the GET request
        request.send();
    }

    loadProgram( program ){
        for( let i = 0; i < program.length; i++ ){
            this.RAM[0x200 + i] = program[i];
        }
    }

    tick(){
        for(let i = 0; i < this.speed; i++ ){
            let opcode = (this.RAM[this.PC] << 8 | this.RAM[this.PC+1]);
            this.PC += 2;
            this.execute(opcode);
        }
        this.renderer.render();
    }

    execute( opcode ){

        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;
        
        switch(opcode & 0xF000){
            case 0x0000:
                switch( opcode & 0xFF ){
                    case 0xE0:
                        this.renderer.clear();
                        break;
                    case 0xEE:
                        this.PC = this.stack.pop();
                        break;
                }
                break;
            case 0x1000:
                this.PC = (opcode & 0xFFF);
                break;
            case 0x2000:
                this.stack.push( this.PC );
                this.PC = (opcode & 0xFFF);
                break;
            case 0x3000:
                break;
            case 0x4000:
                break;
            case 0x5000:
                break;
            case 0x6000:
                this.V[x] = (opcode & 0xFF)
                break;
            case 0x7000:
                this.V[x] += (opcode & 0xFF);
                break;
            case 0x8000:
                break;
            case 0x9000:
                break;
            case 0xA000:
                this.I = (opcode & 0xFFF);
                break;
            case 0xB000:
                break;
            case 0xC000:
                break;
            case 0xD000:
                let n = opcode & 0xF;

                this.V[0xF] = 0;

                for( let i = 0; i < n; i++ ){
                    let row = this.RAM[this.I + i];
                    for( let j = 0; j < 8; j++ ){
                        let value = row & (1 << j);
                        if(value){
                            if(this.renderer.setPixel(this.V[x] + (7-j), this.V[y] + i)){
                                this.V[0xF] = 1;
                            }
                        }
                    }
                }
                break;
            case 0xE000:
                break;
            case 0xF000:
                break;
            default:
                throw new Error('Unknown opcode : ' + opcode );
        }
    }

}

export default CPU;