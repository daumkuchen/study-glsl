precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

// =========================
// UTILITY
// =========================

float map(vec3 p) {
	return length(mod(p, 2.0) - 1.0) - 0.3;
}

// =========================
// MODEL
// =========================

const float modelSize = 1.0;

float sdSphere(vec3 p) {
  return length(p) - modelSize;
}

// float udBox(vec3 p, vec3 b) {
//   return length(max(abs(p)-b,0.0));
// }
//
// float sdTorus(vec3 p, vec2 t) {
//   vec2 q = vec2(length(p.xz)-t.x,p.y);
//   return length(q)-t.y;
// }

float distanceFunc(vec3 p){
  return length(p) - modelSize;
}

// =========================
// NORMAL
// =========================

vec3 getNormal(vec3 p) {
  const float d = 0.0001;
  return
    normalize
    (
      vec3
      (
        sdSphere(p+vec3(d,0.0,0.0))-sdSphere(p+vec3(-d,0.0,0.0)),
        sdSphere(p+vec3(0.0,d,0.0))-sdSphere(p+vec3(0.0,-d,0.0)),
        sdSphere(p+vec3(0.0,0.0,d))-sdSphere(p+vec3(0.0,0.0,-d))
      )
    );
}

// =========================
// ANIMATION
// =========================

vec2 rot(vec2 p, float a) {
	return vec2(
	cos(a) * p.x - sin(a) * p.y,
	sin(a) * p.x + cos(a) * p.y);
}

// =========================
// MAIN
// =========================

void main(void){

  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // camera
  vec3 cPos = vec3(0.0,  0.0,  2.0);
  vec3 cDir = vec3(0.0,  0.0, -1.0);
  vec3 cUp  = vec3(0.0,  1.0,  0.0);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.0;

  // ray
  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  // ray.xz = rot(ray.xz, time * 10.0);
  // ray.yz = rot(ray.yz, time * 10.0);

  // marching loop
  float distance = 0.0;
  float rLen = 0.0;
  vec3  rPos = cPos;
  for(int i = 0; i < 16; i++){
    // distance = sdTorus(rPos, vec2(1.0, 0.5));
    // distance = udBox(rPos, vec3(0.5, 0.5, 0.5));
    distance = distanceFunc(rPos);
    // distance = sdSphere(rPos, 1.0);
    rLen += distance;
    rPos = cPos + ray * rLen;
  }

  vec3 normal = getNormal(rPos);

  // hit check
  if(abs(distance) < 0.001){
    gl_FragColor = vec4(normal, 1.0);
  } else {
    gl_FragColor = vec4(vec3(0.0), 1.0);
  }

}
