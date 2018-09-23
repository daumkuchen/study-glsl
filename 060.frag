#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const int octaves = 5;
const float seed = 43758.5453123;
const float seed2 = 73156.8473192;

float random(float val) {
  return fract(sin(val) * seed);
}

vec2 random2(vec2 st, float seed){
  st = vec2(dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*seed);
}

float random2d(vec2 uv) {
  return fract(sin(dot(uv.xy,vec2(12.9898, 78.233)))*seed);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st, float seed) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);
  return mix( mix( dot( random2(i + vec2(0.0,0.0), seed ), f - vec2(0.0,0.0) ),
                   dot( random2(i + vec2(1.0,0.0), seed ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0), seed ), f - vec2(0.0,1.0) ),
                   dot( random2(i + vec2(1.0,1.0), seed ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 plotCircle(vec2 pos, vec2 uv, float size) {
  return vec3(smoothstep(size, size + 0.05, length(uv - pos)));
}

float fbm (in vec2 st, float seed) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  // Loop of octaves
  for (int i = octaves; i > 0; i--) {
    value += amplitude * abs(noise(st, seed));
    st *= 2.;
    amplitude *= .5;
  }
  return value;
}

float fbm2 (in vec2 st, float seed) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  // Loop of octaves
  for (int i = octaves; i > 0; i--) {
    value += amplitude * noise(st, seed);
    st *= 2.;
    amplitude *= .5;
  }
  return value;
}

float fbm1 (in vec2 st, float seed) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  // Loop of octaves
  for (int i = octaves; i > 0; i--) {
    value += amplitude * fract(noise(st, seed));
    st *= 2.;
    amplitude *= .5;
  }
  return value;
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),sin(_angle),-sin(_angle),cos(_angle));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
       uv *= 5.0;

  float speed = 5.0;

  uv.y -= time / speed;

  mat2 rotation = rotate2d(time / 100.);

  float offsetValX = fbm(uv + rotation * vec2(0.0, time / speed), seed);
  float offsetValY = fbm(uv + rotation * vec2(10.0, time / speed), seed);
  float noiseVal = fbm2(uv + vec2(offsetValX, offsetValY), seed) * 2.0;
  float noiseVal2 = fbm2(uv * 2.0 + vec2(offsetValX, offsetValY), seed) * 2.0;
  float noiseVal3 = fbm2(uv * 3.0 + vec2(offsetValX, offsetValY), seed) * 2.0;

  vec3 color = vec3(noiseVal);
  color += vec3(noiseVal2);
  color /= 2.0;
  color += vec3(noiseVal3);
  color /= 2.0;
  color += vec3(noiseVal);
  color /= 2.0;
  float gradient = (uv.y + time / speed) / 2.5;
  color -= gradient;

  gl_FragColor = vec4(color, 1.0);
}
