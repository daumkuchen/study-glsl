#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

#define EPS       0.0001
#define PI        3.14159265
#define HALFPI    1.57079633
#define ROOTTHREE 1.73205081
#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )

vec2 origin = vec2(0.0);
vec2 uv, pos, pmouse, uvUnit;
float aspect;
bool isLive;

float circle (vec2 center, float radius) {
  return distance(center, pos) < radius ? 1.0 : 0.0;
}

float rect (vec2 center, vec2 b) {
  vec2 bMin = center-b;
  vec2 bMax = center+b;
  return (
    pos.x > bMin.x && pos.y > bMin.y &&
    pos.x < bMax.x && pos.y < bMax.y ) ?
    1.0 : 0.0;
}

int countNeighbors(vec2 p) {
  int count = 0;

  #define KERNEL_R 1
  for (int y=-KERNEL_R; y<=KERNEL_R; ++y)
  for (int x=-KERNEL_R; x<=KERNEL_R; ++x) {
    vec2 spoint = uvUnit*vec2(float(x),float(y));
    if ( texture2D(backbuffer, uv+spoint).a > 0.0 )
      ++count;
  }

  if (isLive)
    --count;

  return count;
}

float gameStep() {
  isLive = texture2D(backbuffer, uv).a > 0.0;
  int neighbors = countNeighbors(uv);

  if (isLive) {
    if (neighbors < 2)
      return 0.0;
    else if (neighbors > 3)
      return 0.0;
    else
      return 1.0;
  }
  else {
    if (neighbors==3)
      return 1.0;
    else
      return 0.0;
  }
}

vec3 ghosting() {
  #define DECAY 0.90
  return DECAY * texture2D(backbuffer, uv).rgb;
}

void main(){
  aspect = resolution.x/resolution.y;
  uvUnit = 1.0 / resolution.xy;

  uv = ( gl_FragCoord.xy / resolution.xy );
  pos = (uv - 0.5);
  pos.x *= aspect;

  pmouse = mouse - vec2(0.5);
  pmouse.x *= aspect;

  float live = 0.0;

  // seed shape
  float radius = 0.05;
  live += circle(pmouse, radius);

  // sim game
  live += gameStep();

  // draw out
  vec3 color = vec3(255);
  color *= live;
  color += ghosting();
  vec4 cout = vec4(color, live);

  // clear;
  // cout = vec4(255);

  gl_FragColor = cout;
}
