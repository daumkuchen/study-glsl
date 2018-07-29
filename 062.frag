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

const float size = 1.;
const vec3 lightDir = vec3(-.5, .5, .5);

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float distanceFunc(vec3 p) {
  return sdSphere(p, size);
}

vec3 getNormal(vec3 p) {
  float d = .0001;
  return normalize(vec3(
    distanceFunc(p + vec3( d, .0, .0)) - distanceFunc(p + vec3(-d, .0, .0)),
    distanceFunc(p + vec3(.0,  d, .0)) - distanceFunc(p + vec3(.0, -d, .0)),
    distanceFunc(p + vec3(.0, .0,  d)) - distanceFunc(p + vec3(.0, .0, -d))
  ));
}

void main(void){

  // vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution);
       uv /= min(resolution.x, resolution.y);

  vec3 ray = normalize(vec3(sin(fov) * uv.x, sin(fov) * uv.y, -cos(fov)));

  float d = .0;
  float rLen = .0;

  vec3 cPos = vec3(.0, .0, 30.);
  vec3 rPos = cPos;

  for(int i = 0; i < 128; i++) {
    d = distanceFunc(rPos);
    rLen += d;
    rPos = cPos + ray * rLen;
  }

  if(abs(d) < .001) {

    vec3 normal = getNormal(rPos);
    float diff = clamp(dot(lightDir, normal), .1, 1.);
    vec3 color = vec3(uv, 1.0);

    gl_FragColor = vec4(vec3(diff + color), 1.);

  } else {

    gl_FragColor = vec4(vec3(.0), 1.);

  }

}
