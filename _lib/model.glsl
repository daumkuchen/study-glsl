#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float size = 1.0;

// sphere
float sdSphere(vec3 p){
  return length(p) - size;
}

// box
const float b = 0.75;
const float r = 0.05;
float udRoundBox(vec3 p){
  return length(max(abs(p)-b,0.0))-r;
}

// torus
const vec2 t = vec2(0.75, 0.25);
float sdTorus(vec3 p){
  // row
  // vec2 q = vec2(length(p.xz) - t.x, p.y);
  // column
  vec2 q = vec2(length(p.xy) - t.x, p.z);
  return length(q)-t.y;
}

// ifs
vec2 ifs(vec3 p) {
    float d1 = 999., d2 = 999.;
    float range = 0.8, radius = 0.5 * (1. + zoom);

    const float maxIter = 8.;
    for (int i = int(maxIter); i > 0; i--) {
        if (i <= iter) {
            break;
        }

        float ratio = float(i) / maxIter;
        float bx = box(p, radius * ratio);
        d1 = mix(d1, min(d1, bx), float(i > iter + 1));
        d2 = min(d2, bx);

        ratio *= ratio;

        p.xz = abs(p.xz) - range * ratio * 0.7;
        p.xz *= rot1;
        p.yz *= rot3;
        p.yx *= rot2;

        p.yz = abs(p.yz) - range * ratio * 0.7;
        p.xz *= rot1;
        p.yz *= rot4;
        p.yx *= rot2;
    }

    return vec2(d1, d2);
}