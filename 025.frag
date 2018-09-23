#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  p *= 10.0;
  vec2 square = floor(p);
  vec3 color = vec3(random(square + time + 0.0), random(square + time + 2.0), random(square + time + 4.0));
  gl_FragColor = vec4(color, 1.0);
}
