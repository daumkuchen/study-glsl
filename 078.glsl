#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

#extension GL_OES_standard_derivatives : enable

// http://glslsandbox.com/e#48525.1

mat2 rotate(float a){
	float c = cos(a);
	float s = sin(a);
	return mat2(c, -s, s, c);
}

float disp(vec3 p){
	float f = 16.;
	float t = time;
	return .08 * cos(p.x * f + t) * cos(p.z * f + t) * cos(p.y * f + t);
}

float map(vec3 p){
	float d = 0.;
	float k = disp(p);
	d = length(p) - .5;
	return d + k;
}

vec3 normal(vec3 p){
	vec3 n, E = vec3(.005, 0., 0.);
	n.x = map(p + E.xyy) - map(p - E.xyy);
	n.y = map(p + E.yxy) - map(p - E.yxy);
	n.z = map(p + E.yyx) - map(p - E.yyx);
	return normalize(n);
}

void main()
{

	vec3 kS = vec3(.7, .5, .9);
	float T = time;
	vec2 uv = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
	vec3 kA = vec3(.0, .0, .0);
	vec3 kD = vec3(.4,
		       .15+cos(time*4.0+uv.y*25.0+cos(time*0.4+uv.x*10.0-uv.y*15.0))*0.45,
		       0.9);
	float ppy = 0.0+sin(T*.3+cos(T*0.3)*3.14)*0.1;
	float ppx = 0.0+cos(T*.4+sin(T*0.5)*3.14)*0.1;

	// ray origin
  vec3 ro = vec3(ppx, ppy, -1.0);

  // ray direction
	vec3 rd = vec3(uv+vec2(ppx,ppy), 1.);

	float t = 0.;
	for (int i = 0; i < 32; i++){
		vec3 p = ro + rd * t;
		t += 0.9 * map(p);
	}
	vec3 p = ro + rd * t;
	vec3 n = normal(p);
	float TT = T * 0.2 + sin(T*0.4)*3.14;
	vec3 lp = normalize(vec3(-cos(TT)*1.7+3.14/4.0, 1., 3.14*-0.5+0.2*cos(TT)*1.4) - p);
	float diff = 1.75 * clamp(dot(lp, n), 0., 1.);
	float spec = 9.5 * pow(max(dot(reflect(-lp, n), ro), 0.), 120.);

	if (t < 1.)
  {

		// gl_FragColor = vec4(1. / t * t * .01 + .05  + diff + spec);
		// gl_FragColor = vec4(.05 * diff + spec, 1.);
		gl_FragColor = clamp(vec4(kA + kD * diff + kS * spec, 1.), 0.0,1.0);

	} else {

		gl_FragColor = vec4(vec3(0.), 1.);

  }
}
