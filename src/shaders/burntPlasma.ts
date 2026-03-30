export const burntPlasmaFrag = `
precision highp float;
uniform float time;
uniform vec2 resolution;

// Renk Paleti Fonksiyonu (Inigo Quilez tekniği)
vec3 palette( in float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557); 
    return a + b*cos( 6.28318*(c*t+d) );
}

// Basit Rastgelelik (Random)
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

// Gürültü (Noise) Fonksiyonu
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

// Fraktal Brownian Motion (fBm)
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
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
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    
    // Ölçeklendirme (Zoom)
    st *= 3.0;

    vec3 color = vec3(0.0);

    // Domain Warping (Alan Bükülmesi) İşlemi
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

    float f = fbm(st+r);

    // Renk Karışımı
    color = palette(f * 2.0 + length(q) + time * 0.2);

    // Kontrastı artırmak için
    color = pow(color, vec3(1.2)); 
    
    // Siyah alanları (gölgeleri) biraz daha belirginleştir
    color = mix(color, vec3(0.0, 0.0, 0.1), clamp(length(r)*0.5, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
`;
