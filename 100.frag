#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define TWO_PI 6.2831853072
#define PI 3.14159265359
#define HALF_PI 1.57079632679

vec4 mod289(vec4 x)
{
  return x - floor(x * (1. / 289.)) * 289.;
}

float mod289(float x)
{
	return x - floor(x * (1. / 289.)) * 289.;
}

vec4 permute(vec4 x)
{
	return mod289(((x * 34.) + 1.) * x);
}

float permute(float x)
{
	return mod289(((x * 34.) + 1.) * x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
{
  const vec4 ones = vec4(1., 1., 1., -1.);
  vec4 p,s;

  p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz * 2. - 1.) * s.www;

  return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
{
  const vec4 C = vec4(0.138196601125011,  // (5 - sqrt(5))/20  G4
                      0.276393202250021, // 2 * G4
                      0.414589803375032, // 3 * G4
                     -0.447213595499958);  // -1 + 4 * G4

	// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)));
  vec4 x0 = v -   i + dot(i, C.xxxx);

	// Other corners

	// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);
	// i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1. - isX;
	// i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1. - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1. - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0., 1.);
  vec4 i2 = clamp( i0 - 1., 0., 1.);
  vec4 i1 = clamp( i0 - 2., 0., 1.);

  // x0 = x0 - 0.0 + 0.0 * C.xxxx
  // x1 = x0 - i1  + 1.0 * C.xxxx
  // x2 = x0 - i2  + 2.0 * C.xxxx
  // x3 = x0 - i3  + 3.0 * C.xxxx
  // x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

	// Permutations
  i = mod289(i);
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute(permute(permute(permute(
             i.w + vec4(i1.w, i2.w, i3.w, 1.0))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0));

	// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

	// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4, p4));

	// Mix contributions from the five corners
  vec3 m0 = max(.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.);
  vec2 m1 = max(.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * (dot(m0 * m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)))
               + dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4))));
}

float sdSphere(vec3 p, float s)
{
	float modValue = snoise(vec4(1. * normalize(p), .2 * time));
  return length(p) - (s + .5 * modValue);
}

vec2 map(in vec3 pos)
{
  return vec2(sdSphere(pos, 1.), 2.);
}

vec2 castRay(in vec3 ro, in vec3 rd)
{
  float tmin = 1.;
  float tmax = 10.;

	float precis = 1.;
  float t = tmin;
  float m = -1.;
  for(int i = 0; i < 1; i++)
  {
  	vec2 res = map(ro + rd*t);
    if(res.x < precis || t > tmax) break;
    t += res.x;
  	m = res.y;
  }

  if(t > tmax) m =- 1.;
  return vec2(t, m);
}

vec3 calcNormal(in vec3 pos)
{
	vec3 eps = vec3(.25, 0., 0.);
	vec3 nor = vec3(
    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
    map(pos+eps.yyx).x - map(pos-eps.yyx).x);
	return normalize(nor);
}

vec3 render(in vec3 ro, in vec3 rd)
{
  vec3 col = vec3(0.);
  vec2 res = castRay(ro, rd);
  float t = res.x;
	float m = res.y;
  if(m > -1.)
  {
    vec3 pos = ro + t * rd;
    vec3 nor = abs(calcNormal(pos));
    col = vec3(1.);
    float rim = dot(vec3(1., 1., 1.), nor);
    float value = cos( rim * TWO_PI * 20.);

    col *= smoothstep(.1, 1., value );
  }
	return col;
}

mat3 setCamera(in vec3 ro, in vec3 ta, float cr)
{
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(sin(cr), cos(cr), 0.);
	vec3 cu = normalize(cross(cw,cp));
	vec3 cv = normalize(cross(cu,cw));
  return mat3(cu, cv, cw);
}

mat3 rotZ(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat3(
    c, -s, 0,
    s, c, 0,
    0,0, 1
  );
}

void main()
{

	vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 q = uv;
  vec2 p = -1. + 2. * q;
	p.x *= resolution.x / resolution.y;

	vec3 ro = vec3(0., 0., -5.);

	vec3 rd = normalize(vec3(p.xy, 2.));

  vec3 col = render(ro, rd);
	col = pow(col, vec3(.5));
  gl_FragColor = vec4(col, 1.);

}
