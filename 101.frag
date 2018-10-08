#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

float random (in vec2 p)
{
  return fract(sin(dot(p.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 p)
{
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 p)
{
  float value = 0.0;
  float amplitud = 0.2;
  float frequency = .9;
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitud * noise(p);
    p *= 2.0;
    amplitud *= 0.8;
  }
  return value;
}

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float n = fbm(vec2(length(uv * 10.) + time * .1));
  vec3 color = vec3(n);
  color = color * 2.;

  gl_FragColor = vec4(color, 1.);

}
