#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main() {

  vec2 tUv = gl_FragCoord.xy - resolution / 2.;
       tUv = vec2(length(tUv) / resolution.y - .3, atan(tUv.x, tUv.y));

  vec4 s = .07 * cos(1.5 * vec4(0, 1, 2, 3) + time + tUv.y + sin(tUv.y) * cos(time));
  vec4 e = s.yzwx;
  vec4 f = max(tUv.x - s, e - tUv.x);

  gl_FragColor = dot(clamp(f * resolution.y, 0., 1.), 75. * (s - e)) * (s - .1) + f;

}