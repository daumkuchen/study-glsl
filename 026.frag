#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

// Simplex 2D noise
// vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
// float snoise(vec2 v){
// const vec4 C = vec4(0.211324865405187, 0.366025403784439,
// -0.577350269189626, 0.024390243902439);
// vec2 i = floor(v + dot(v, C.yy) );
// vec2 x0 = v - i + dot(i, C.xx);
// vec2 i1;
// i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
// vec4 x12 = x0.xyxy + C.xxzz;
// x12.xy -= i1;
// i = mod(i, 289.0);
// vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
// + i.x + vec3(0.0, i1.x, 1.0 ));
// vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
// dot(x12.zw,x12.zw)), 0.0);
// m = m*m ;
// m = m*m ;
// vec3 x = 2.0 * fract(p * C.www) - 1.0;
// vec3 h = abs(x) - 0.5;
// vec3 ox = floor(x + 0.5);
// vec3 a0 = x - ox;
// m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
// vec3 g;
// g.x = a0.x * x0.x + h.x * x0.y;
// g.yz = a0.yz * x12.xz + h.yz * x12.yw;
// return 130.0 * dot(m, g);
// }
// vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
// vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
// float noise(vec3 p){
// vec3 a = floor(p);
// vec3 d = p - a;
// d = d * d * (3.0 - 2.0 * d);
// vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
// vec4 k1 = perm(b.xyxy);
// vec4 k2 = perm(k1.xyxy + b.zzww);
// vec4 c = k2 + a.zzzz;
// vec4 k3 = perm(c);
// vec4 k4 = perm(c + 1.0);
// vec4 o1 = fract(k3 * (1.0 / 41.0));
// vec4 o2 = fract(k4 * (1.0 / 41.0));
// vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
// vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
// return o4.y * d.y + o4.x * (1.0 - d.y);
// }

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

void main(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  p *= 0.5;
  vec2 pos = vec2(p) * 2.0;
  float r = snoise(vec3(pos.x, pos.y + 0.02, time * 1.0)) * 0.8;
  float g = snoise(vec3(pos.x, pos.y + 0.05, time * 1.0)) * 2.0;
  float b = snoise(vec3(pos.x, pos.y + 0.08, time * 1.0)) * 2.0;
  gl_FragColor = vec4(vec3(r, g, b) * .2, 1.0);
}
