import * as THREE from 'three';
export const CAMERA_POINTS=[
 new THREE.Vector3(0,.25,7.5),new THREE.Vector3(1.5,.7,5.5),new THREE.Vector3(2.0,-.1,3.5),
 new THREE.Vector3(.15,.05,.3),new THREE.Vector3(-1.4,.6,-4.5),new THREE.Vector3(2.0,-.4,-9),
 new THREE.Vector3(.5,.1,-14.5),new THREE.Vector3(0,.2,-19),new THREE.Vector3(0,0,-23)
];
export const TARGET_POINTS=[
 new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,-.2),new THREE.Vector3(0,0,-1.2),
 new THREE.Vector3(0,0,-5),new THREE.Vector3(0,0,-10),new THREE.Vector3(0,0,-15),
 new THREE.Vector3(0,0,-20),new THREE.Vector3(0,0,-24),new THREE.Vector3(0,0,-28)
];
export function createCameraTimeline(){return {position:new THREE.CatmullRomCurve3(CAMERA_POINTS,false,'centripetal'),target:new THREE.CatmullRomCurve3(TARGET_POINTS,false,'centripetal')}}
export const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
export const damp=(current:number,target:number,lambda:number,dt:number)=>THREE.MathUtils.lerp(current,target,1-Math.exp(-lambda*dt));
export function stageAt(p:number){return p<.14?0:p<.28?1:p<.42?2:p<.57?3:p<.71?4:p<.85?5:6}
