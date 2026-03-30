import React, { useRef, useEffect } from 'react';

export default function DeepFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vsSource = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;

      // Rastgelelik fonksiyonu (Noise için gerekli)
      float random (in vec2 _st) {
          return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Gürültü (Noise) Fonksiyonu - Organik doku yaratır
      float noise (in vec2 _st) {
          vec2 i = floor(_st);
          vec2 f = fract(_st);

          // Four corners in 2D of a tile
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(a, b, u.x) +
                  (c - a)* u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
      }

      // Fractal Brownian Motion (FBM) - Gürültü katmanları
      #define NUM_OCTAVES 5
      float fbm ( in vec2 _st) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          // Rotasyon matrisi
          mat2 rot = mat2(cos(0.5), sin(0.5),
                          -sin(0.5), cos(0.50));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(_st);
              _st = rot * _st * 2.0 + shift;
              a *= 0.5;
          }
          return v;
      }

      void main() {
          // Koordinatları normalize et ve en boy oranını düzelt
          vec2 st = gl_FragCoord.xy/uResolution.xy;
          st.x *= uResolution.x/uResolution.y;

          // Koordinatları ortala ve ölçekle
          vec2 p = st * 3.0;

          // DOMAIN WARPING (Alan Kıvrılması) Tekniği
          // Bir gürültü fonksiyonunun sonucunu, diğerinin girdisi olarak kullanıyoruz.
          
          vec2 q = vec2(0.);
          q.x = fbm( p + 0.00 * uTime);
          q.y = fbm( p + vec2(1.0));

          vec2 r = vec2(0.);
          r.x = fbm( p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime );
          r.y = fbm( p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

          float f = fbm(p + r);

          // Renk Paleti Karışımı
          vec3 color = vec3(0.0);

          // 1. Katman: Koyu ve gizemli taban (Siyah - Koyu Lacivert)
          color = mix(vec3(0.101961,0.619608,0.666667),
                      vec3(0.666667,0.666667,0.498039),
                      clamp((f*f)*4.0,0.0,1.0));

          // 2. Katman: Akışkanlık efekti (Lacivert - Mor geçişleri)
          color = mix(color,
                      vec3(0,0,0.164706),
                      clamp(length(q),0.0,1.0));

          // 3. Katman: Parlaklıklar (Açık Mavi - Turkuaz)
          color = mix(color,
                      vec3(0.666667,1,1),
                      clamp(length(r.x),0.0,1.0));

          // Kontrast ayarı
          color = pow(color, vec3(1.2)); 
          
          // Vignette (Köşeleri karartma) efekti
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          uv *=  1.0 - uv.yx;
          float vig = uv.x*uv.y * 20.0;
          vig = pow(vig, 0.25);
          
          gl_FragColor = vec4(color * vig, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader hatası:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program hatası:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    const uTimeLocation = gl.getUniformLocation(program, "uTime");
    const uResolutionLocation = gl.getUniformLocation(program, "uResolution");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let animationFrameId: number;
    let isIntersecting = false;
    const startTime = performance.now();

    const render = () => {
      if (!isIntersecting) return;

      const displayWidth = Math.floor(canvas.clientWidth / 2);
      const displayHeight = Math.floor(canvas.clientHeight / 2);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const time = (performance.now() - startTime) * 0.001;
      gl.uniform1f(uTimeLocation, time);
      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
      cancelAnimationFrame(animationFrameId);
      if (isIntersecting) {
        render();
      }
    });

    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block object-cover" />;
}
