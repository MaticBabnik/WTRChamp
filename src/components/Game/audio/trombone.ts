import type { tPolyWad, tWad } from '@/stores/audio';
import Wad from 'web-audio-daw';




const A4_FREQUENCY = 440;
function tromboneChampPitchToFreq(pitch: number): number {
    const noteNumber = 60 + (pitch / 13.75);
    return (A4_FREQUENCY / 32) * (Math.pow(2, ((noteNumber - 9) / 12)));
}


export class Trombone {
    protected oscillators: tWad[];
    protected poly: tPolyWad;

    protected playing: boolean = false;

    public play(trPitch: number) {
        const pitch = tromboneChampPitchToFreq(trPitch);

        this.setPitch(pitch);

        if (!this.playing) {
            this.oscillators.forEach(o => o.play());
            this.playing = true;
        }
    }

    protected setPitch(pitch: number) {
        this.oscillators.forEach(o => o.setPitch(pitch));
    }

    public stop() {
        this.oscillators.forEach(o => o.stop());
        this.playing = false;
    }

    constructor(volume: number) {
        console.log(volume);
        this.oscillators = [
            {
                source: 'sawtooth',
                volume: 1.0,
                env: {      
                    attack: 0,  
                    decay: 0.1,  
                    sustain: 0.8,  
                    hold: 12, 
                    release: 0.03     
                },
            }, {
                source: 'sawtooth',
                volume: 1.0,
                env: {      
                    attack: 0.02,  
                    decay: 0.1,  
                    sustain: 0.6,  
                    hold: 12, 
                    release: 0.03     
                },
            }
        ].map(obj => new Wad(obj));

        this.poly = new Wad.Poly({
            filter: [
                {
                    type: 'lowpass', 
                    frequency: 1200,       
                    q: 0,         
                    /*
                      env       : {          
                          frequency : 1200, 
                          attack    : 0.5  
                      }
                      */
                },
                { type: 'highpass', frequency: 520, q: 0 }
            ],
            /*
              delay   : {
                  delayTime : .5,  
                  wet       : .25, 
                  feedback  : .25, 
              },
              vibrato : { 
                  shape     : 'sine', 
                  magnitude : 3,      
                  speed     : 4,      
                  attack    : 0       
              },
              tremolo : { 
                  shape     : 'sine', 
                  magnitude : 3,      
                  speed     : 4,      
                  attack    : 0       
              },
              tuna   : {
                  Chorus : {
                      intensity: 0.3,  
                      rate: 4,         
                      stereoPhase: 0, 
                      bypass: 0
                  }
              }
              */
        });

        this.oscillators.forEach(x=>x.setVolume(volume / 10_000));
    }
}