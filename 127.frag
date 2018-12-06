#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);

  uv = fract(uv * 4.) * 2. - 1.;
  uv.x += pow(sin(time), 2.);
  float l = 1. - length(uv);

  vec4 dest = vec4(vec3(l), 1.);

  gl_FragColor = dest;

}
