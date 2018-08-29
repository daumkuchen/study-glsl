#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float PI = 3.1415926;

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
// ==================== MESH

float dist(vec3 pos)
{
  pos = abs(pos);
  pos -= 1.0;
  return length(pos) - 0.5;
}

vec3 normal(vec3 pos)
{
  vec2 d = vec2(0.0, 1E-2);
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
    if (d < 0.001)
    {
      float c = float(i) / 32.0;
      vec3 normal = normal(pos);
      float d = dot(-normal, normalize(vec3(1.0)));
      return vec3(d * c);
    }
    pos += d * dir;
  }
  return vec3(1.0, 1.0, 1.0);
}

//
// ==================== MAIN

void main(){

  vec2 xy = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;

  mat3 rot = rotY(time);

  vec3 pos = rot * vec3(0, 0, -5.);
  vec3 dir = rot * normalize(vec3(xy, 1.));

  vec3 col = march(pos, dir);

	// vec3 col2 = vec3(1. + sin(time), 0., 1. + sin(time));

  gl_FragColor = vec4(col, 1.);

}
