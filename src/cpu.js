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

        this.loadFonts()
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
        if( this.delayTimer > 0 ) this.delayTimer--;
        if( this.soundTimer > 0 ) this.soundTimer--;
        this.renderer.render();
    }

    execute( opcode ){

        let x   = (opcode & 0x0F00) >> 8;
        let y   = (opcode & 0x00F0) >> 4;
        let nnn = (opcode & 0xFFF);
        let kk  = (opcode & 0xFF);

        let temp = null;
        
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
                this.PC = nnn;
                break;
            case 0x2000:
                this.stack.push( this.PC );
                this.PC = nnn;
                break;
            case 0x3000:
                if( V[x] == kk ){
                    this.PC += 2;
                }
                break;
            case 0x4000:
                if( V[x] != kk ){
                    this.PC += 2;
                }
                break;
            case 0x5000:
                if( (opcode & 0xF == 0x0) && V[x] == V[y] ){
                    this.PC += 2;
                }
                break;
            case 0x6000:
                this.V[x] = kk;
                break;
            case 0x7000:
                this.V[x] += kk;
                break;
            case 0x8000:
                switch( opcode & 0xF ){
                    case 0x0:
                        this.V[x] = this.V[y];
                        break;
                    case 0x1:
                        this.V[x] |= this.V[y];
                        break;
                    case 0x2:
                        this.V[x] &= this.V[y];
                        break;
                    case 0x3:
                        this.V[x] ^= this.V[y];
                        break;
                    case 0x4:
                        let sum = this.V[x] + this.V[y];
                        this.V[0xF] = 0;
                        if( sum > 255 ){
                            this.V[0xF] = 1;
                        }
                        this.V[x] = sum;
                        break;
                    case 0x5:
                        let diff = this.V[x] - this.V[y];
                        this.V[0xF] = 0;
                        if( this.V[x] > this.V[y] ){
                            this.V[0xF] = 1; 
                        }
                        this.V[x] = diff;
                        break;
                    case 0x6:
                        this.V[0xF] = this.V[x] & 0x1;
                        this.V[x] = this.V[x] >> 1;
                        break;
                    case 0x7:
                        diff = this.V[y] - this.V[x];
                        this.V[0xF] = 0;
                        if( this.V[y] > this.V[x] ){
                            this.V[0xF] = 1; 
                        }
                        this.V[x] = diff;
                        break;
                    case 0xE:
                        this.V[0xF] = this.V[x] & 0x80;
                        this.V[x] = this.V[x] << 1;
                        break;
                        
                }
                break;
            case 0x9000:
                if( this.V[x] != this.V[y] ){
                    this.PC += 2;
                }
                break;
            case 0xA000:
                this.I = (opcode & 0xFFF);
                break;
            case 0xB000:
                this.PC = nnn + this.V[0];
                break;
            case 0xC000:
                let random = Math.floor(Math.random() * 0x100 );
                this.V[x] = random & kk;
                break;
            case 0xD000:
                let sprite_height   = opcode & 0xF;
                let sprite_width    = 8;

                this.V[0xF] = 0;

                for( let r = 0; r < sprite_height; r++ ){
                    let row = this.RAM[this.I + r];
                    for( let c = 0; c < sprite_width; c++ ){
                        let value = row & (1 << c);
                        if(value){
                            if(this.renderer.setPixel(this.V[x] + (7-c), this.V[y] + r)){
                                this.V[0xF] = 1;
                            }
                        }
                    }
                }
                break;
            case 0xE000:
                switch( opcode & 0xFF ){
                    case 0x9E:
                        //...some code here...
                        break;
                    case 0xA1:
                        //...some code here...
                        break;
                } 
                break;
            case 0xF000:
                switch( opcode & 0xFF ){
                    case 0x07:
                        this.V[x] = this.delayTimer;
                        break;
                    case 0x0A:
                        //...some code here...
                        break;
                    case 0x15:
                        this.delayTimer = this.V[x];
                        break;
                    case 0x18:
                        this.soundTimer = this.V[x];
                        break;
                    case 0x1E:
                        this.I += this.V[x];
                        break;
                    case 0x29:
                        this.I = this.V[x] * 5
                        break
                    case 0x33:
                        temp = this.V[x];
                        this.RAM[this.I] = Math.floor(temp / 100);
                        temp %= 100;
                        this.RAM[this.I+1] = Math.floor( temp / 10 );
                        temp %= 10;
                        this.RAM[this.I+2] = Math.floor(temp);
                        break;
                    case 0x55:
                        for( let i = 0; i <= x; i++ ){
                            this.RAM[this.I + i] = this.V[i];
                        }
                        break;
                    case 0x65:
                        for( let i = 0; i <= x; i++ ){
                            this.V[i] = this.RAM[this.I + i];
                        }
                        break;
                } 
                break;
            default:
                throw new Error('Unknown opcode : ' + opcode );
        }
    }

}

export default CPU;