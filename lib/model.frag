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
