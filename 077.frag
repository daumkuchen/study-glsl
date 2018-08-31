#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

uniform sampler2D cat1;

void main(){

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  tUv += mod(tUv, .1) - .05;

  vec4 t = texture2D(cat1, tUv);

  // tex
  vec3 tex = vec3(t.r, t.g, t.b);

  // mono
  float mono = t.r + t.g + t.b - 1.;
  vec3 texMono = vec3(mono);

  gl_FragColor = vec4(tex, 1.);

}
