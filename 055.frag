#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float plasma(vec2 p, float q){
  p *= q;
  return(sin(p.x) * 0.25 + 0.25) + (sin(p.y) * 0.25 + 0.25);
}

void main(){

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 dest = vec3(plasma(p + (time * 0.2), 10.0));
  gl_FragColor = vec4(dest, 1.0);
}
