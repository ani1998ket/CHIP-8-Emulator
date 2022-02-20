class Speaker{
    constructor(){
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
    }

    play(frequency){
        this.oscillator = this.audioCtx.createOscillator();
        this.oscillator.frequency.value = frequency;
        this.oscillator.connect( this.audioCtx.destination );
        this.oscillator.start();
    }
    stop(){
        this.oscillator.stop();
        this.oscillator.disconnect( this.audioCtx.destination );
    }
}

export default Speaker;