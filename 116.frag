#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

// http://www.iquilezles.org/www/articles/warp/warp.htm

const mat2 m = mat2(.8, .6, -.6, .8);

float noise( in vec2 x )
{
	return sin(1.5 * x.x) * sin(1.5 * x.y);
}

float fbm4( vec2 p )
{
  float f = 0.;
  f += .5000 * noise(p); p = m * p * 2.02;
  f += .2500 * noise(p); p = m * p * 2.03;
  f += .1250 * noise(p); p = m * p * 2.01;
  f += .0625 * noise(p);
  return f / .9375;
}

float fbm6( vec2 p )
{
  float f = 0.0;
  f += .500000 * (.5 + .5 * noise(p)); p = m * p * 2.02;
  f += .250000 * (.5 + .5 * noise(p)); p = m * p * 2.03;
  f += .125000 * (.5 + .5 * noise(p)); p = m * p * 2.01;
  f += .062500 * (.5 + .5 * noise(p)); p = m * p * 2.04;
  f += .031250 * (.5 + .5 * noise(p)); p = m * p * 2.01;
  f += .015625 * (.5 + .5 * noise(p));
  return f / .96875;
}

float func(vec2 q, out vec4 ron, float t)
{
  float ql = length(q);
  q.x += .05 * sin(.27 * t + ql * 4.1);
  q.y += .05 * sin(.23 * t + ql * 4.3);
  q *= .5;

	vec2 o = vec2(0.);
  o.x = .5 + .5 * fbm4(vec2(2. * q));
  o.y = .5 + .5 * fbm4(vec2(2. * q + vec2(5.2)));

	float ol = length(o);
  o.x += .02 * sin(.12 * t + ol) / ol;
  o.y += .02 * sin(.14 * t + ol) / ol;

  vec2 n;
  n.x = fbm6(vec2(4. * o + vec2(9.2)));
  n.y = fbm6(vec2(4. * o + vec2(5.7)));

  vec2 p = 4. * q + 4. * n;

  float f = .5 + .5 * fbm4(p);

  f = mix(f, f * f * f * 3.5, f * abs(n.x));

  float g = .5 + .5 * sin(4. * p.x) * sin(4. * p.y);
  f *= 1. - .5 * pow(g, 8.);

	ron = vec4(o, n);

  return f;
}

vec3 render(vec2 p)
{
  float t = time * 2.;
	vec2 q = p * .6;
  vec4 on = vec4(0.);
  float f = func(q, on, t);

	vec3 col = vec3(0.);
  // col = mix(vec3(.2, .1, .4), vec3(.3, .05, .05), f);
  col = mix(col, vec3(.9, .9, .9), dot(on.zw, on.zw));
  // col = mix(col, vec3(.4, .3, .3), .5 * on.y * on.y);
  // col = mix(col, vec3(.0, .2, .4), .5 * smoothstep(1.2, 1.3, abs(on.z) + abs(on.w)));
  col = clamp(col * f * 2., 0., 1.);

	// vec3 nor = normalize( vec3( dFdx(f)*resolution.x, 6.0, dFdy(f)*resolution.y ) );
  vec3 nor = normalize(vec3(f * resolution.x, 6., f * resolution.y));

  vec3 lig = normalize(vec3(.9, -.2, -.4));
  float dif = clamp(.3 + .7 * dot(nor, lig), 0., 1.);
  vec3 bdrf;
  bdrf = vec3(.7, .9, .95) * (nor.y * .5 + .5);
  bdrf += vec3(.15, .10, .05) * dif;
  col *= 1.2 * bdrf;
	col = 1. - col;
	return 1.1 * col * col;
}

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  gl_FragColor = vec4(render(uv), 1.);

}
