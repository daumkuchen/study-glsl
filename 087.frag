#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.1415926;
float gTime = 0.;

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
// ==================== OBJ

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float sdTorus(vec3 p, vec2 t){
  vec2 q = vec2(length(p.xy) - t.x, p.z);
  return length(q)-t.y;
}

//
// ==================== MESH

float dist(vec3 pos)
{

  // abs
  // pos = abs(pos);
  // pos -= 1.;

  // fract
  // pos = fract(pos);
  // pos += -1.;

  // mod
  float modpow = 2.;
  pos = mod(pos, modpow * 2.) - modpow;

  mat3 rotx = rotX(time * 3.);
  mat3 roty = rotY(time * 2.);

  vec3 p = rotx * roty * pos;

  // return sdSphere(pos, .5);
  return sdTorus(p, vec2(.6, .3));

}

vec3 normal(vec3 pos)
{
  vec2 d = vec2(0., 1E-2);
  return normalize(vec3(
    dist(pos + d.yxx) - dist(pos - d.yxx),
    dist(pos + d.xyx) - dist(pos - d.xyx),
    dist(pos + d.xxy) - dist(pos - d.xxy)
  ));
}

vec3 march(vec3 pos, vec3 dir)
{
  for (int i = 0; i < 32; ++i)
  {
    float d = dist(pos);
    if (d < .001)
    {

      float ii = float(i);

      float c = ii / 32.;
      vec3 n = normal(pos);

      // float d = dot(-n, normalize(vec3(1.)));
      float d = dot(n, normalize(vec3(1.)));
            d = 1. / d;

      return vec3(d);

    }
    pos += d * dir;
  }

  // background
  // return vec3(1., 1., 1.);
  return vec3(.5, .5, .5);

}

vec4 render(vec2 p, float t)
{
  mat3 rotx = rotX(t * .3);
  mat3 roty = rotY(t * .2);
  vec3 pos = vec3(0, 0, -3.5);
  vec3 dir = rotx * roty * normalize(vec3(p, 1.));
  vec3 col = march(pos, dir);
  return vec4(col, 1.);
}

//
// ==================== MAIN

void main(){

  // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.x;
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  vec4 color = vec4(0.);
  const int iter = 16;
  for(int i = 0; i < iter; i++)
  {
    float fi = float(i);
    gTime = time - fi * .0015;
    // color += render(uv, time);
    color += render(uv, gTime);
  }
  color /= float(iter);
  gl_FragColor = color;

}
