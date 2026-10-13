import * as THREE from 'three';
export function createParticleField(count:number){
 const positions=new Float32Array(count*3),sizes=new Float32Array(count),seeds=new Float32Array(count),colors=new Float32Array(count*3);let state=739341;
 const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 for(let i=0;i<count;i++){const z=rand()*46-33,a=rand()*Math.PI*2,r=1.5+rand()*10;positions.set([Math.cos(a)*r,Math.sin(a)*r*.75,z],i*3);sizes[i]=2+rand()*8;seeds[i]=rand()*Math.PI*2;const blue=rand()>.3;colors.set(blue?[.23+rand()*.12,.48+rand()*.14,1]:[.43+rand()*.25,.73+rand()*.2,.52],i*3)}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('aColor',new THREE.BufferAttribute(colors,3));
 const uniforms={uTime:{value:0},uProgress:{value:0},uPixelRatio:{value:1},uPointer:{value:new THREE.Vector2()}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`attribute float aSize;attribute float aSeed;attribute vec3 aColor;uniform float uTime;uniform float uProgress;uniform float uPixelRatio;uniform vec2 uPointer;varying vec3 vColor;varying float vFade;void main(){vec3 p=position;p.x+=sin(uTime*.11+aSeed+p.z*.16)*.18+uPointer.x*.1;p.y+=cos(uTime*.13+aSeed)*.13+uPointer.y*.1;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uPixelRatio*5./max(-mv.z,.3),1.,28.);vColor=aColor;vFade=smoothstep(.1,2.,-mv.z)*(1.-smoothstep(20.,45.,-mv.z));}`,fragmentShader:`varying vec3 vColor;varying float vFade;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float core=pow(1.-r,2.);gl_FragColor=vec4(vColor,core*vFade*.72);}`});
 return {points:new THREE.Points(geometry,material),uniforms,geometry,material};
}
