#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
       uv *= 1.2;
  vec3 dest = vec3(1. - uv, 1.);
  gl_FragColor = vec4(dest, 1.);
}
