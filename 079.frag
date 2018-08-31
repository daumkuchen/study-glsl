#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;


struct Ray
{
  vec3 origin;
  vec3 direction;
};

struct Sphere
{
  float radius;
  vec3  position;
  vec3  color;
};

struct Plane
{
  vec3 position;
  vec3 normal;
  vec3 color;
};

struct Intersection
{
  int hit;
  vec3 hitPoint;
  vec3 normal;
  vec3 color;
  float distance;
  vec3 rayDir;
};

const vec3 LDR = vec3(0.577);
const float EPS = 0.0001;
const int MAX_REF = 4;

Sphere sphere[3];
Plane plane;

void intersectInit(inout Intersection I)
{
  I.hit      = 0;
  I.hitPoint = vec3(0.0);
  I.normal   = vec3(0.0);
  I.color    = vec3(0.0);
  I.distance = 1.0e+30;
  I.rayDir   = vec3(0.0);
}

void intersectSphere(Ray R, Sphere S, inout Intersection I)
{
  vec3  a = R.origin - S.position;
  float b = dot(a, R.direction);
  float c = dot(a, a) - (S.radius * S.radius);
  float d = b * b - c;
  float t = -b - sqrt(d);
  if(d > 0.0 && t > EPS && t < I.distance){
    I.hitPoint = R.origin + R.direction * t;
    I.normal = normalize(I.hitPoint - S.position);
    d = clamp(dot(LDR, I.normal), 0.1, 1.0);
    I.color = S.color * d;
    I.distance = t;
    I.hit++;
    I.rayDir = R.direction;
  }
}

void intersectPlane(Ray R, Plane P, inout Intersection I)
{
  float d = -dot(P.position, P.normal);
  float v = dot(R.direction, P.normal);
  float t = -(dot(R.origin, P.normal) + d) / v;
  if(t > EPS && t < I.distance){
    I.hitPoint = R.origin + R.direction * t;
    I.normal = P.normal;
    float d = clamp(dot(LDR, I.normal), 0.1, 1.0);
    float m = mod(I.hitPoint.x, 2.0);
    float n = mod(I.hitPoint.z, 2.0);
    if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
      d *= 0.5;
    }
    float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
    I.color = P.color * d * f;
    I.distance = t;
    I.hit++;
    I.rayDir = R.direction;
  }
}

void intersectExec(Ray R, inout Intersection I)
{
  intersectSphere(R, sphere[0], I);
  intersectSphere(R, sphere[1], I);
  intersectSphere(R, sphere[2], I);
  intersectPlane(R, plane, I);
}

void main(){

  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // ray init
  Ray ray;
  ray.origin = vec3(0.0, 2.0, 6.0);
  ray.direction = normalize(vec3(p.x, p.y, -1.0));

  // sphere init
  sphere[0].radius = 0.5;
  sphere[0].position = vec3(0.0, -0.5, sin(time));
  sphere[0].color = vec3(1.0, 0.0, 0.0);
  sphere[1].radius = 1.0;
  sphere[1].position = vec3(2.0, 0.0, cos(time * 0.666));
  sphere[1].color = vec3(0.0, 1.0, 0.0);
  sphere[2].radius = 1.5;
  sphere[2].position = vec3(-2.0, 0.5, cos(time * 0.333));
  sphere[2].color = vec3(0.0, 0.0, 1.0);

  // plane init
  plane.position = vec3(0.0, -1.0, 0.0);
  plane.normal = vec3(0.0, 1.0, 0.0);
  plane.color = vec3(1.0);

  // intersection init
  Intersection its;
  intersectInit(its);

  // hit check
  vec3 destColor = vec3(ray.direction.y);
  vec3 tempColor = vec3(1.0);
  Ray q;
  intersectExec(ray, its);
  if(its.hit > 0){
    destColor = its.color;
    tempColor *= its.color;
    for(int j = 1; j < MAX_REF; j++){
      q.origin = its.hitPoint + its.normal * EPS;
      q.direction = reflect(its.rayDir, its.normal);
      intersectExec(q, its);
      if(its.hit > j){
        destColor += tempColor * its.color;
        tempColor *= its.color;
      }
    }
  }

  gl_FragColor = vec4(destColor, 1.0);

}
