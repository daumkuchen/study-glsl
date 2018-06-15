#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float pi = 3.14159265;

float rnd(vec3 p) {
  vec3 i = floor(p);
  vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
  vec3 f = cos((p - i) * pi * 10.0) * (-.5) + .5;
  a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
  a.xy = mix(a.xz, a.yw, a.y);
  return mix(a.x, a.y, a.z);
}

void main(void){
	vec2 p = (gl_FragCoord.xy / resolution.xy);
  gl_FragColor = vec4(vec3(rnd(p.xyy * 32.0) * 10.0), 1.0);
}
