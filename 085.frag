#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

vec2 circle(vec2 p) {
  return vec2(length(p), .5);
}

vec2 spuare(vec2 p) {
  return vec2(abs(p.x) + abs(p.y), .5);
}

vec2 hex(vec2 p, float s) {
  vec2 q = abs(p);
  return vec2(max(q.x * .57735 + q.y - 1. * s, q.x - .866 * s), .5);
  // p.x *= 0.57735*2.0;
	// p.y += mod(floor(p.x), 2.0)*0.5;
	// p = abs((mod(p, 1.0) - 0.5));
	// return vec2(abs(max(p.x*1.5 + p.y, p.y*2.0) - 1.0), .5);
}

vec2 morphing(vec2 p) {

  float t = time * 2.5;

  int pair = int(floor(mod(t, 3.)));

  float a = smoothstep(.2, .8, mod(t, 1.));

  if(pair == 0) return mix(circle(p), spuare(p), a);
  if(pair == 1) return mix(spuare(p), hex(p, .1), a);
    else return mix(hex(p, .1), circle(p), a);

}

void main(){

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // 01
  // vec2 c = circle(uv);
  // vec3 color = vec3(1.);
  // if(float(c) < .8) {
  //   color = vec3(0.);
  // }
  // gl_FragColor = vec4(vec3(color), 1.);

  // 02
  // vec2 c = circle(uv);
  // vec3 color = mix(vec3(1.), vec3(0.), step(float(c), .8));
  // gl_FragColor = vec4(vec3(color), 1.);

  // 03
  // float a = sin(time * 5.) * .5 + .5;
  // vec2 c = circle(uv);
  // vec2 s = spuare(uv);
  // vec2 h = hex(uv, .2);
  // vec2 d = mix(c, h, a);
  // vec3 color = mix(vec3(1.), vec3(0.), step(d.x, d.y));
  // gl_FragColor = vec4(vec3(color), 1.);

  // 04
  vec2 d = morphing(uv);
  vec3 color = mix(vec3(1.), vec3(0.), step(d.x, d.y));
  gl_FragColor = vec4(vec3(color), 1.);




}
