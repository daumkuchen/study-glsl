#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float rings(vec2 p){
  vec2 c = mod(p * 8.0, 4.0) - 2.0;
  return sin(length(c * 2.0) * 16.0);
}

void main(void){

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 dest = vec3(rings(p * 10.0 + (time * 0.02)));
  vec3 color = vec3(1.0, 1.0, 1.0);

  gl_FragColor = vec4(dest * color, 1.0);
}
