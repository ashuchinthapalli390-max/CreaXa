import * as THREE from 'three';
function ribbon(curve:THREE.Curve<THREE.Vector3>,segments:number,width:number,twist:number){
 const points=curve.getPoints(segments),frames=curve.computeFrenetFrames(segments,false);const positions:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let i=0;i<=segments;i++){const t=i/segments,a=twist*t;const side=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a));const w=width*(.35+.65*Math.sin(Math.PI*t));for(const sign of [-1,1]){const v=points[i].clone().addScaledVector(side,w*sign*.5);positions.push(v.x,v.y,v.z);uv.push(sign===-1?0:1,t)}if(i<segments){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function createSculpture(material:THREE.MeshPhysicalMaterial){
 const group=new THREE.Group();group.name='CreaXa sculpture';
 const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.28,.045,18,160),material);orbit.rotation.set(.13,.22,.05);group.add(orbit);
 const inner=new THREE.Mesh(new THREE.TorusGeometry(1.19,.014,10,128),material);inner.rotation.set(.13,.22,.05);group.add(inner);
 const c=new THREE.Shape();[[-.05,.5],[-.38,.5],[-.63,.16],[-.52,-.29],[-.19,-.49],[.26,-.43],[.45,-.18],[.23,-.13],[.10,-.25],[-.14,-.29],[-.33,-.17],[-.4,.09],[-.25,.29],[.01,.29]].forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
 const letter=new THREE.Mesh(new THREE.ExtrudeGeometry(c,{depth:.1,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.026,bevelThickness:.02}),material);letter.position.set(0,0,-.05);group.add(letter);
 const cross=new THREE.Group();for(const sign of [-1,1]){const bar=new THREE.Mesh(new THREE.BoxGeometry(.10,.63,.13),material);bar.rotation.z=sign*.49;cross.add(bar)}cross.position.set(.34,.17,0);group.add(cross);
 for(let k=0;k<3;k++){const pts:THREE.Vector3[]=[];for(let j=0;j<=15;j++){const t=j/15,ang=t*Math.PI*2.7+k*2.09;const radius=.65+Math.sin(t*Math.PI)*.75;pts.push(new THREE.Vector3(Math.sin(ang)*radius,-3.1+t*5.7,Math.cos(ang)*radius*.55))}const strand=new THREE.Mesh(ribbon(new THREE.CatmullRomCurve3(pts),200,k===0?.085:.032,Math.PI*3),material);strand.position.z=-.28;group.add(strand)}
 return {group,orbit,inner,letter,cross};
}
