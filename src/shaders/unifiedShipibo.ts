export const unifiedShipiboFrag = `
precision highp float;
uniform float time;
uniform vec2 resolution;

// --- SPIRIT PALETTE (Updated for Unified Look) ---
// Deep Jungle Green, Mystic Purple, Soul Gold
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.15, 0.20);
    return a + b*cos( 6.28318*(c*t+d) );
}

// Rotation Matrix
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {
    // Normalize and center UVs (-1 to 1)
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
    vec2 uv0 = uv; // Keep original for "Third Eye" glow
    vec3 finalColor = vec3(0.0);
    
    // --- THE UNIFIED TRIP LOOP ---
    for (float i = 0.0; i < 4.0; i++) {
        
        // 1. UNIFIED GEOMETRY (No Grid/Fract)
        // Instead of tiling, we use absolute symmetry to create one giant structure
        uv = abs(uv) - 0.9; // Mirror fold from center
        
        // Rotate each iteration to weave the pattern together
        uv *= rot(time * 0.1 + i); 

        // 2. THE MOTHER VINE MOVEMENT
        // A larger, slower sine wave for the "breathing" effect of the whole screen
        // Since we removed 'fract', we adjust the scale here
        uv += sin(uv.yx * 2.5 + time * 0.4) * 0.3;

        // 3. SHIPIBO PATTERN GENERATION
        // Calculate distance for the lines
        float d = length(uv);

        // Coloring based on depth, time and iteration
        vec3 col = palette(length(uv0) + i * 0.4 + time * 0.3);

        // The "Neon Lines" calculation
        // We increase frequency since the domain is larger now
        d = sin(d * 10.0 + time) / 10.0;
        d = abs(d);

        // Invert and sharpen for "Glow" effect
        // Made slightly softer for a more "organic" feel
        d = pow(0.012 / d, 1.2);

        // Accumulate color
        finalColor += col * d;
    }
    
    // --- POST PROCESSING (The Tunnel) ---
    // A stronger vignette to focus the eye on the center entity
    finalColor *= 1.2 - length(uv0) * 0.8;
    
    // Tone Mapping
    finalColor = pow(finalColor, vec3(0.8));

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
