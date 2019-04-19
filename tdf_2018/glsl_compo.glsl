#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float PI = 3.14159265;
const float angle = 60.;
const float fov = angle * .5 / PI / 180.;
const vec3 lightDir = normalize(vec3(-.5, .5, .5));
const vec3 ambient = vec3(-.5, .5, .5);

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;
  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,
                        0.309016994374947451);
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;
  i = mod(i, 289.0);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}

float random (in vec2 _uv){
  return fract(sin(dot(_uv.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
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

#define NUM_OCTAVES 5
float fbm(vec3 x){
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

vec3 rotate(vec3 p, float angle, vec3 axis){
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float r = 1.0 - c;
  mat3 m = mat3(
    a.x * a.x * r + c,
    a.y * a.x * r + a.z * s,
    a.z * a.x * r - a.y * s,
    a.x * a.y * r - a.z * s,
    a.y * a.y * r + c,
    a.z * a.y * r + a.x * s,
    a.x * a.z * r + a.y * s,
    a.y * a.z * r - a.x * s,
    a.z * a.z * r + c
  );
  return m * p;
}

float sdSphere(vec3 p, float s){
  return length(p) - s;
}

vec2 distanceFunc(vec3 p){
  float t = time * .2;
  float n = fbm(normalize(p) + t) * 6.;
        n = snoise(vec4(vec3(n) * .2, .1));
  vec3 r = rotate(p, radians(time * 20.), vec3(1.));
  float s = sdSphere(r, 1. + n * .5);

  return vec2(s);
}

vec3 getNormal(vec3 p){
  vec3 d = vec3(.2, 0., 0.);
  return normalize(vec3(
    distanceFunc(p + d.xyy).x - distanceFunc(p - d.xyy).x,
    distanceFunc(p + d.yxy).x - distanceFunc(p - d.yxy).x,
    distanceFunc(p + d.yyx).x - distanceFunc(p - d.yyx).x
  ));
}

void main(){

  vec3 lightDir = normalize(vec3(sin(time * 20.), cos(time * 20.), 1.));

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  vec3 ray = normalize(vec3(sin(fov) * uv.x, sin(fov) * uv.y, -cos(fov)));

  vec2 d = vec2(0.);
  vec2 rLen = vec2(0.);

  vec3 cPos = vec3(.0, .0, 1.);
  vec3 rPos = cPos;

  for(int i = 0; i < 12; i++){
    d = distanceFunc(rPos);
    rLen += d;
    rPos = cPos + ray * vec3(rLen, 1.);
  }

  vec3 normal = getNormal(rPos);

  float diffuse = max(dot(lightDir, normal), 0.);
  float specular = max(dot(normal, lightDir), 0.);
        specular = pow(specular, 2.);
  vec3 ambientColor = min(ambient + diffuse, 1.);

  float dot = dot(vec3(.0), normal);
  float value = cos(dot * PI * 16.);

  float r1 = random(vec2(time));
  vec3 fCol = vec3(.7);
  vec3 nCol1 = vec3(normal.z * 1., normal.z * 10., normal.z * (4. - sin(time * .5)));
  vec3 nCol2 = vec3(normal.z * 2., normal.z * 1., normal.z * (2. - sin(time * .5))) * (cos(time * .7) + 1.);
  vec3 col = nCol1 * nCol2 * fCol;

  col *= smoothstep(.01, .1, value);
  col = abs(col - .01) * 6.;
  col = col + (random(normal.yz) * .1);

  vec3 dest = (.8 - col + vec3(specular)) * .2;

  gl_FragColor = (vec4(dest, 1.) + (texture2D(backbuffer, tUv) * .9)) * 1.;

}
