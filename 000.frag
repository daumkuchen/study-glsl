#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
