export function createAmbientAudio(){
 const context=new AudioContext();const gain=context.createGain();gain.gain.value=.012;const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=350;const notes=[55,82.5,110];const oscillators=notes.map((hz,i)=>{const o=context.createOscillator();o.type='sine';o.frequency.value=hz;o.detune.value=i*2;o.connect(filter);o.start();return o});filter.connect(gain);gain.connect(context.destination);
 return {resume:()=>context.resume(),mute:(muted:boolean)=>gain.gain.setTargetAtTime(muted?0:.012,context.currentTime,.15),dispose:()=>{oscillators.forEach(o=>o.stop());context.close().catch(()=>{})}};
}
