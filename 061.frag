#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 dest = vec3(1. - uv, 1.0);
  gl_FragColor = vec4(dest, 1.0);
}
