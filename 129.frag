#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

#extension GL_OES_standard_derivatives : enable

void main() {

  // 画面左から x = 0.4, 0.5, 0.6

  // edge = 0.5で上から順番に
  // x >= edge
  // x <= edge
  // x > edge
  // x < edge

  // vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // 0.4 or 0.5 or 0.6
  float x = floor(mix(.4, .699999, uv.x) * 10.) / 10.;

  //  0.0 or 0.25, or 0.5, or 0.75 or
  float y = floor(mix(0., .999999, 1. - uv.y) * 4.) / 4.;

  vec4 v1;
  float edge = .5;

  // 1.0 if x >= edge, else 0.0
  v1.x = step(edge, x);

  // 1.0 if x <= edge, else 0.0
  v1.y = step(x, edge);

  // 1.0 if x > edge, else 0.0
  v1.z = 1. - step(x, edge);

  // 1.0 if x < edge, else 0.0
  v1.w = 1. - step(edge, x);

  vec4 v2 = 1. - abs(sign(vec4(y) - vec4(0., .25, .5, .75)));

  gl_FragColor = vec4(vec3(dot(v1, v2)), 1.);

}
