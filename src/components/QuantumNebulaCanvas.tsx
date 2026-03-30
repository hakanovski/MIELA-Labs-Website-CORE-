import React, { useRef, useEffect } from 'react';

export default function QuantumNebulaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    const vsSource = `#version 300 es
      in vec4 position;
      void main() { gl_Position = position; }
    `;
    
    const fragSource = `#version 300 es
      precision highp float;
      out vec4 O;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 move;

      #define R resolution
      #define T (time * 0.2)
      #define ROT(a) mat2(cos(a), -sin(a), sin(a), cos(a))

      vec3 palette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557); 
          return a + b * cos(6.28318 * (c * t + d));
      }

      vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          return mat2(c, -s, s, c) * v;
      }

      void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - R) / min(R.x, R.y);
          vec2 uv0 = uv; 
          
          uv = rotate(uv, length(move) * 0.002);

          vec3 finalColor = vec3(0.0);
          
          for (float i = 0.0; i < 4.0; i++) {
              uv = fract(uv * 1.5) - 0.5;
              float d = length(uv) * exp(-length(uv0));
              vec3 col = palette(length(uv0) + i * 0.4 + T);
              d = sin(d * 8.0 + T) / 8.0;
              d = abs(d);
              d = pow(0.01 / d, 1.2);
              finalColor += col * d;
          }
          
          finalColor = pow(finalColor, vec3(1.4));
          O = vec4(finalColor, 1.0);
      }
    `;
    
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const moveLocation = gl.getUniformLocation(program, "move");

    let animationFrameId: number;
    const startTime = performance.now();
    let isIntersecting = false;
    
    let mouse = { dx: 0, dy: 0 };
    let lastX = 0, lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.dx += e.movementX;
      mouse.dy += e.movementY;
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      mouse.dx += (x - lastX);
      mouse.dy += (y - lastY);
      lastX = x;
      lastY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    const render = () => {
      if (!isIntersecting) return;

      const displayWidth = Math.floor(canvas.clientWidth / 2);
      const displayHeight = Math.floor(canvas.clientHeight / 2);
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }

      const currentTime = (performance.now() - startTime) / 1000.0;
      
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(moveLocation, mouse.dx, mouse.dy);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        cancelAnimationFrame(animationFrameId);
        if (isIntersecting) {
          render();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block cursor-move"
      style={{ touchAction: 'none' }}
    />
  );
}
