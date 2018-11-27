#ifdef GL_ES
precision mediump float;
#endif

// https://qiita.com/gam0022/items/1342a91d0a6b16a3a9ba
#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
uniform sampler2D cat1;
uniform sampler2D cat2;

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  // vec4 _texture1 = texture2D(cat1, tUv);

  vec4 color = texture2D(cat1, tUv);
  float gray = length(color.rgb) * 3.;

  float x = dFdx(gray);
  float y = dFdy(gray);
  vec2 xy = vec2(x, y);

  // x
  // vec4 dest = vec4(vec3(dFdy(gray)) * 5., 1.);

  // y
  // vec4 dest = vec4(vec3(length(xy)), 1.);

  // step
  // vec4 dest = vec4(vec3(step(.2, length(xy))), 1.);

  // amoothstep
  vec4 dest = vec4(vec3(smoothstep(.1, .5, length(xy))), 1.);

  // negative
  // vec4 dest = vec4(1. - vec3(smoothstep(.1, .5, length(xy))), 1.);

  gl_FragColor = dest;

}
