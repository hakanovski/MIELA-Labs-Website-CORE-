import React, { useEffect, useRef, useState } from 'react';

const vertShaderSource = `
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragShaderSource = `
    precision mediump float;

    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_vignette;
    uniform float u_ratio;
    uniform float u_img_ratio;
    uniform float u_intensity;

    // --- NOISE FUNCTIONS ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = vUv;
        
        // Correct Aspect Ratio
        vec2 ratio = vec2(
            min((u_ratio / u_img_ratio), 1.0),
            min((u_img_ratio / u_ratio), 1.0)
        );
        vec2 baseUv = vec2(
            uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            uv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );
        
        // Mouse Interaction (Distance Field)
        float dist = distance(uv, u_mouse);
        float mouseEffect = smoothstep(0.4, 0.0, dist) * 0.05; // Mouse creates a "dent"

        // Liquid Distortion Logic
        float t = u_time * 0.2;
        float noise1 = snoise(uv * 3.0 + vec2(t, t * 1.5));
        float noise2 = snoise(uv * 10.0 - vec2(t * 2.0, t));
        
        // Combine noises for more organic feel
        float finalNoise = noise1 * 0.5 + noise2 * 0.1;
        
        // Intensity controlled by user interaction or default wave
        float distortionStrength = u_intensity + mouseEffect; 
        
        // RGB SHIFT (Chromatic Aberration)
        // We sample the texture 3 times at slightly different positions based on noise
        float r = texture2D(u_texture, baseUv + finalNoise * distortionStrength * 1.0).r;
        float g = texture2D(u_texture, baseUv + finalNoise * distortionStrength * 1.05).g;
        float b = texture2D(u_texture, baseUv + finalNoise * distortionStrength * 1.1).b;

        vec3 color = vec3(r, g, b);

        // Film Grain
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233) * u_time)) * 43758.5453);
        color -= grain * 0.04;

        // Vignette
        float vignette = length(uv - 0.5);
        color *= 1.0 - vignette * u_vignette;

        gl_FragColor = vec4(color, 1.0);
    }
`;

const DEFAULT_IMG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export default function LiquidLensCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    let animationFrameId: number;
    let isIntersecting = false;
    let imageTexture: WebGLTexture | null = null;
    let currentImageRatio = 1;
    let mouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };

    const createShader = (gl: WebGLRenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, vertShaderSource, gl.VERTEX_SHADER);
    const fs = createShader(gl, fragShaderSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const uniforms = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_ratio: gl.getUniformLocation(program, "u_ratio"),
      u_img_ratio: gl.getUniformLocation(program, "u_img_ratio"),
      u_texture: gl.getUniformLocation(program, "u_texture"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
      u_intensity: gl.getUniformLocation(program, "u_intensity"),
      u_vignette: gl.getUniformLocation(program, "u_vignette"),
    };

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const loadImage = (src: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        currentImageRatio = img.width / img.height;
        
        if (imageTexture) gl.deleteTexture(imageTexture);
        imageTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
    };

    loadImage(DEFAULT_IMG);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Render at half resolution for performance
      const pixelRatio = 0.5;
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    // Initial resize needs a small delay to ensure container is rendered
    setTimeout(resize, 0);

    const render = () => {
      if (!isIntersecting) return;
      
      const time = performance.now() * 0.001;
      
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      gl.useProgram(program);
      gl.uniform1f(uniforms.u_time, time);
      gl.uniform1f(uniforms.u_ratio, canvas.height > 0 ? canvas.width / canvas.height : 1);
      gl.uniform1f(uniforms.u_img_ratio, currentImageRatio);
      gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
      
      gl.uniform1f(uniforms.u_intensity, 0.02 + Math.sin(time) * 0.005); 
      gl.uniform1f(uniforms.u_vignette, 0.6);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
      cancelAnimationFrame(animationFrameId);
      if (isIntersecting) {
        resize(); // Ensure correct size when becoming visible
        render();
      }
    });

    observer.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Update WebGL mouse
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - ((e.clientY - rect.top) / rect.height);

      // Update custom cursor
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Expose a method to load a new image from the input
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            loadImage(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.addEventListener('change', handleFileChange);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (fileInput) {
        fileInput.removeEventListener('change', handleFileChange);
      }
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      
      if (imageTexture) gl.deleteTexture(imageTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-[#050505] overflow-hidden group cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
      />

      {/* Custom Cursor Ring */}
      <div 
        className="absolute rounded-full border border-white/50 pointer-events-none z-20 mix-blend-exclusion transition-all duration-200 ease-out"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          width: isActive ? '30px' : '40px',
          height: isActive ? '30px' : '40px',
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent'
        }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-10 mix-blend-difference text-white">
        <div className="font-syncopate font-bold text-xl md:text-2xl tracking-tighter uppercase">
          LIQUID_LENS
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-inter text-[10px] tracking-[3px] uppercase opacity-0 group-hover:opacity-60 transition-opacity duration-500">
          [ CLICK TO UPLOAD IMAGE ]
        </div>

        <div className="flex justify-between items-end font-inter text-[9px] md:text-[11px] tracking-widest leading-relaxed opacity-80">
          <div>
            SHADER: RGB_DISPLACEMENT<br/>
            NOISE: SIMPLEX_FBM<br/>
            STATUS: ACTIVE
          </div>
          <div className="text-right">
            DRAG TO DISTORT<br/>
            SCROLL TO ZOOM
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full object-cover" />
    </div>
  );
}
