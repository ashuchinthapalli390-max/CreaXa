import * as THREE from 'three';
import {createSculpture} from '../geometry/sculpture';
import {createParticleField} from '../particles/field';
export function createWorld(mobile:boolean){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#05070e');scene.fog=new THREE.FogExp2('#05070e',.018);
 const chrome=new THREE.MeshPhysicalMaterial({color:'#7c8dce',metalness:1,roughness:.22,iridescence:.85,iridescenceIOR:1.35,iridescenceThicknessRange:[140,510],clearcoat:1,clearcoatRoughness:.16,side:THREE.DoubleSide,envMapIntensity:1.6});
 const sculpture=createSculpture(chrome);scene.add(sculpture.group);
 const particles=createParticleField(mobile?2200:5600);scene.add(particles.points);
 scene.add(new THREE.AmbientLight('#465682',.3));
 const key=new THREE.DirectionalLight('#ceddff',4);key.position.set(-4,5,5);scene.add(key);
 const cyan=new THREE.PointLight('#5be6ee',32,30,2);cyan.position.set(3,-1,2);scene.add(cyan);
 const pink=new THREE.PointLight('#be56b1',24,26,2);pink.position.set(-3,.1,-2);scene.add(pink);
 const constellation=new THREE.Group();constellation.position.z=-11;
 const pearl=new THREE.MeshPhysicalMaterial({color:'#4b7fd2',metalness:.92,roughness:.28,iridescence:1,clearcoat:1,envMapIntensity:1.3});
 const orbGeometry=new THREE.IcosahedronGeometry(.09,2);const spheres=new THREE.InstancedMesh(orbGeometry,pearl,120);const transform=new THREE.Object3D();for(let i=0;i<120;i++){const a=i*.64,y=(i/120-.5)*8,r=1.9+.35*Math.sin(i*.12);transform.position.set(Math.sin(a)*r,y,Math.cos(a)*r);transform.scale.setScalar(.45+(i%7)*.14);transform.updateMatrix();spheres.setMatrixAt(i,transform.matrix)}spheres.instanceMatrix.needsUpdate=true;constellation.add(spheres);scene.add(constellation);
 const portal=new THREE.Group();portal.position.z=-22;
 for(let i=0;i<5;i++){const mesh=new THREE.Mesh(new THREE.TorusGeometry(2.25+i*.11,.022,8,96),chrome);mesh.position.z=-i*.5;mesh.rotation.set(.04*i,.07*i,.08*i);portal.add(mesh)}
 const haloLight=new THREE.PointLight('#87cfff',48,24,2);haloLight.position.set(0,0,-21);scene.add(haloLight);
 const frames=new THREE.Group();for(let i=0;i<3;i++){const geo=new THREE.TorusGeometry(.8,.03,8,4);const mesh=new THREE.Mesh(geo,pearl);mesh.rotation.z=Math.PI*.25;mesh.position.set((i-1)*2.45,Math.sin(i)*.6,-18.5);frames.add(mesh)}scene.add(frames,portal);
 return {scene,chrome,pearl,sculpture,particles,constellation,spheres,portal,frames,key,cyan,pink};
}
