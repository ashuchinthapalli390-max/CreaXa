'use client';
import { useEffect, useRef } from 'react';
export default function Scene() {
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = canvas.current;
        if (!c)
            return;
        const gl = c.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
        if (!gl)
            return;
        const vs = 'attribute vec2 pos;void main(){gl_Position=vec4(pos,0.,1.);}';
        const fs = `precision mediump float;
uniform vec2 res;uniform float time;uniform vec2 mouse;uniform float scroll;
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float scene(vec3 p){p.xz=rot(time*.16+mouse.x*.3+scroll*.25)*p.xz;p.yz=rot(.7+mouse.y*.2)*p.yz;p.xy=rot(p.z*.48)*p.xy;vec2 q=vec2(length(p.xy)-1.27,p.z);return length(q)-.39;}
vec3 norm(vec3 p){vec2 e=vec2(.002,0);return normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));}
void main(){vec2 uv=(gl_FragCoord.xy-res*.5)/res.y;vec3 ro=vec3(0.,0.,4.8-min(scroll,1.5)*.35);vec3 rd=normalize(vec3(uv,-1.8));float t=0.;float d=0.;vec3 p;for(int i=0;i<70;i++){p=ro+rd*t;d=scene(p);if(d<.002||t>10.)break;t+=d*.8;}if(t>10.){gl_FragColor=vec4(0.);return;}vec3 n=norm(p);vec3 r=reflect(rd,n);float light=max(dot(n,normalize(vec3(-2.,3.,4.))),0.);float fres=pow(1.+dot(rd,n),3.);float spec=pow(max(dot(r,normalize(vec3(-2.,3.,4.))),0.),35.);float stripe=pow(abs(sin(r.y*4.+r.z*3.)),7.);vec3 metal=vec3(.16,.19,.16)+vec3(.48,.54,.47)*light+vec3(.8,.94,.57)*stripe*.6+vec3(.79,1.,.3)*fres*.7+vec3(1.)*spec;gl_FragColor=vec4(metal,1.);}`;
        function shader(type: number, src: string) { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; }
        const p = gl.createProgram()!;
        const a = shader(gl.VERTEX_SHADER, vs), b = shader(gl.FRAGMENT_SHADER, fs);
        gl.attachShader(p, a);
        gl.attachShader(p, b);
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
            return;
        gl.useProgram(p);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(p, 'pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        let frame = 0;
        let x = 0, y = 0, visible = true;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const pointer = (e: PointerEvent) => { x = (e.clientX / innerWidth - .5); y = (e.clientY / innerHeight - .5); };
        window.addEventListener('pointermove', pointer);
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        io.observe(c);
        const draw = (t: number) => { if (visible) {
            const ratio = Math.min(devicePixelRatio, 1.5);
            const w = Math.round(c.clientWidth * ratio), h = Math.round(c.clientHeight * ratio);
            if (c.width !== w || c.height !== h) {
                c.width = w;
                c.height = h;
                gl!.viewport(0, 0, w, h);
            }
            gl!.uniform2f(gl!.getUniformLocation(p, 'res'), w, h);
            gl!.uniform1f(gl!.getUniformLocation(p, 'time'), reduced ? 0 : t / 1000);
            gl!.uniform2f(gl!.getUniformLocation(p, 'mouse'), reduced ? 0 : x, reduced ? 0 : y);
            gl!.uniform1f(gl!.getUniformLocation(p, 'scroll'), reduced ? 0 : window.scrollY / innerHeight);
            gl!.drawArrays(gl!.TRIANGLES, 0, 6);
        } frame = requestAnimationFrame(draw); };
        frame = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', pointer); io.disconnect(); gl.deleteProgram(p); gl.deleteShader(a); gl.deleteShader(b); gl.deleteBuffer(buffer); };
    }, []);
    return <div className="scene" aria-label="Interactive sculptural creative connection"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="scene-glow"/><canvas ref={canvas} aria-hidden="true"/><div className="scene-label top">IDEA → POSSIBILITY</div><div className="scene-label bottom">HUMAN VISION. AI CAPABILITY.</div><div className="scene-caption"><span className="live-dot"/>A NEW KIND OF CREATIVE CONNECTION</div><span className="scene-coordinate">CX / 001</span></div>;
}

