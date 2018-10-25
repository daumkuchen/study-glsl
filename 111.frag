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

// Simplex 3D Noise
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
vec3 i = floor(v + dot(v, C.yyy) );
vec3 x0 = v - i + dot(i, C.xxx) ;
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );
vec3 x1 = x0 - i1 + 1.0 * C.xxx;
vec3 x2 = x0 - i2 + 2.0 * C.xxx;
vec3 x3 = x0 - 1. + 3.0 * C.xxx;
i = mod(i, 289.0 );
vec4 p = permute( permute( permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
float n_ = 1.0/7.0; // N=7
vec3 ns = n_ * D.wyz - D.xzx;
vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );
vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);
vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));
vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
dot(p2,x2), dot(p3,x3) ) );
}

vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
vec3 a = floor(p);
vec3 d = p - a;
d = d * d * (3.0 - 2.0 * d);
vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
vec4 k1 = perm(b.xyxy);
vec4 k2 = perm(k1.xyxy + b.zzww);
vec4 c = k2 + a.zzzz;
vec4 k3 = perm(c);
vec4 k4 = perm(c + 1.0);
vec4 o1 = fract(k3 * (1.0 / 41.0));
vec4 o2 = fract(k4 * (1.0 / 41.0));
vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
return o4.y * d.y + o4.x * (1.0 - d.y);
}

float sdSphere(vec3 p, float s)
{
	// float modValue = snoise(vec4(1. * normalize(p), .2 * time));
  float modValue = noise(vec3(p + time * .2));
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
