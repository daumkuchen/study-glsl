#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float s1 = step(uv.x, sin(time * 2.));
  float s2 = step(uv.y, sin(time * 2.));

  vec3 dest = vec3(s1 * s2);

  gl_FragColor = vec4(dest, 1.);

}
