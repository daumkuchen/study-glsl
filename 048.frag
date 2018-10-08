/*{ "audio": true }*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;
uniform sampler2D samples;
uniform float volume;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
const float size = 1.0;
const vec3 lightDir = vec3(-0.75, 0.75, 0.5);

vec3 trans(vec3 p){
  return mod(p, 8.0) - 4.0;
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

float sdSphere(vec3 p) {
  return length(p) - size;
}

float distanceFunc(vec3 p){

  vec3 r = rotate(p, radians(time * 50.0), vec3(1.0, 1.0, 1.0));

  vec3 t = twist(p, sin(time * 2.0) * 10.0);

  float s1 = sdSphere(p);

  float d1 =
    (sin(2.75 * r.x * 1.0)) * ((sin(time * 2.0) * 1.0)) *
    (sin(2.75 * r.y * 1.0)) * ((sin(time * 2.0) * 1.0)) *
    (sin(2.75 * r.z * 1.0)) * ((sin(time * 2.0) * 1.0));

  float d2 =
    (mod(sin(2.75 * p.x * 5.0), 1.0)) * 1.0 *
    (mod(sin(2.75 * p.y * 5.0), 1.0)) * 1.0 *
    (mod(sin(2.75 * p.z * 5.0), 1.0)) * 1.0;

  float d3 =
    (sin(2.75 * r.x * 1.0)) * ((volume * 0.02)) *
    (sin(2.75 * r.y * 1.0)) * ((volume * 0.02)) *
    (sin(2.75 * r.z * 1.0)) * ((volume * 0.02));

  return smoothMin(s1 + d1, s1 - d1, 1.0);
  // return smoothMin(s1, s1, 2.0);

}

vec3 getNormal(vec3 p){
  float d = 0.0001;
  return normalize(vec3(
    distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
  ));
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
  float distance = 0.0;
  float rLen = 0.0;
  vec3 cPos = vec3(0.0, 0.0, 5.0);
  vec3 rPos = cPos;

  for(int i = 0; i < 128; i++){
    distance = distanceFunc(rPos);
    rLen += distance;
    rPos = cPos + ray * rLen;
  }

  if(abs(distance) < 0.001){

    vec3 normal = getNormal(rPos);
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);

    for(float i = 1.0; i < 3.0; i++) {
      p.x += 0.2 / i * sin(i * 1.0 * p.y + time * 1.0 + cos((time / (100.0 * i)) * i));
      p.y += 0.4 / i * cos(i * 1.0 * p.x + time * 2.0 + sin((time / (200.0 * i)) * i));
    }

    float r = cos(p.x + p.y + 2.) * 0.5 + 0.5;
    float g = sin(p.x + p.y + 1.) * 0.5 + 0.5;
    float b = r + g;
    vec3 color = vec3(r, g, b) * 0.25;
    vec3 pink = vec3(0.5, -0.3, 0.5);

    gl_FragColor = vec4(vec3((pink + color) + diff), 1.0);

  } else {

    for(float i = 1.0; i < 3.0; i++) {
      p.x += 0.2 / i * sin(i * 1.0 * p.y + time * 1.0 + cos((time / (100.0 * i)) * i));
      p.y += 0.4 / i * cos(i * 1.0 * p.x + time * 2.0 + sin((time / (200.0 * i)) * i));
    }

    float r = cos(p.x + p.y + 2.) * 0.5 + 0.5;
    float g = sin(p.x + p.y + 1.) * 0.5 + 0.5;
    float b = r + g;
    vec3 bg = vec3(r, g, b) * 0.9;

    float sp1 = texture2D(spectrum, vec2(0.0)).x * 10000.0;

    gl_FragColor = vec4(bg, 1.0);


  }

}
