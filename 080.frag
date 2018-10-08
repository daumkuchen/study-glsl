#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float PI = 3.14159265;
const float angle = 60.;
const float fov = angle * .5 / PI / 180.;

const vec3 lightDir = normalize(vec3(-.5, .5, .5));
const vec3 ambient = vec3(.05, .05, .05);

//
// ==================== MAT

mat2 rot2d(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}

mat3 rotX(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat3(
    1, 0, 0,
    0, c, -s,
    0, s, c
  );
}

mat3 rotY(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat3(
    c, 0, -s,
    0, 1, 0,
    s, 0, c
  );
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

//
// ==================== TRANS

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

vec3 trans(vec3 p, float c) {
  return mod(p, c) - (c * .5);
}

vec3 twist(vec3 p, float power){
  float s = sin(power * p.y);
  float c = cos(power * p.y);
  mat3 m = mat3(
      c, 0.0,  -s,
    0.0, 1.0, 0.0,
      s, 0.0,   c
  );
  return m * p;
}

float smoothMin(float d1, float d2, float k){
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(h) / k;
}

float opS( float d1, float d2 )
{
  return max(-d2,d1);
}

float opU(float d1, float d2)
{
  return min(d1,d2);
}

vec3 opRep( vec3 p, vec3 c )
{
  return mod(p,c)-0.5*c;
}

//
// ==================== OBJ

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float sdTorus(vec3 p, vec2 t){
  vec2 q = vec2(length(p.xy) - t.x, p.z);
  return length(q)-t.y;
}

// float sdPlane(vec3 p, vec4 n)
// {
//   // n must be normalized
//   return dot(p,n.xyz) + n.w;
// }

// float sdPlane(vec3 p)
// {
// 	return p.y;
// }

float sdFloor(vec3 p){
  return dot(p, vec3(0., 1., 0.)) + 1.;
}

//
// ==================== MESH

float distanceFunc(vec3 p) {

  // vec2 res = opU(
  //   vec2(sdPlane(p), 1.),
  //   vec2(sdSphere(p - vec3(0., .25, 0.), .25), 1.)
  // );

  // mat rotate
  mat3 rx = rotX(time * 1.);
  mat3 ry = rotY(time * 1.);

  // torus
  float torus1 = sdTorus(p * rx, vec2(1., .5));

  // plane
  // float plane1 = sdPlane(p, vec4(0., 10., .2, 1.));
  // float plane1 = sdPlane(p) + p.z;

  // floor
  float floor1 = sdFloor(p);

  return min(torus1, floor1);
}

vec3 getNormal(vec3 p) {
  float d = .0001;
  return normalize(vec3(
    distanceFunc(p + vec3( d, .0, .0)) - distanceFunc(p + vec3(-d, .0, .0)),
    distanceFunc(p + vec3(.0,  d, .0)) - distanceFunc(p + vec3(.0, -d, .0)),
    distanceFunc(p + vec3(.0, .0,  d)) - distanceFunc(p + vec3(.0, .0, -d))
  ));
}

//
// ==================== MAIN

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 ray = normalize(vec3(sin(fov) * uv.x, sin(fov) * uv.y, -cos(fov)));

  float d = .0;
  float rLen = .0;

  vec3 cPos = vec3(.0, .0, 50.);
  vec3 rPos = cPos;

  for(int i = 0; i < 128; i++) {
    d = distanceFunc(rPos);
    rLen += d;
    rPos = cPos + ray * rLen;
  }

  if(abs(d) < .001) {

    vec3 normal = getNormal(rPos);

    // lambert
    // float diffuse = clamp(dot(lightDir, normal), .1, 1.);

    // phong
    float diffuse = max(dot(lightDir, normal), 0.);

    float specular = max(dot(normal, lightDir), 0.);
          specular = pow(specular, 12.) * .8;

    vec3 ambientColor = min(ambient + diffuse, 1.);

    // vec3 color = vec3(.1);
    vec3 color = vec3(1. - uv, 1.);

    vec3 dest = (color * ambientColor) + vec3(specular);

    gl_FragColor = vec4(dest, 1.);

  } else {

    vec3 color = vec3(.1);
    // vec3 color = vec3(uv, 1.);

    float vignette = 1.5 - length(uv) * .5;
    color *= vignette;

    gl_FragColor = vec4(color, 1.);

  }

}
