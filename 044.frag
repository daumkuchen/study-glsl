#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
// https://wgld.org/d/glsl/g011.html
// https://wgld.org/d/glsl/g012.html

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
const float size = 1.0;
const vec3 lightDir = vec3(-0.5, 0.5, 0.5);

// rotate
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

// twist
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

// 補間用
float smoothMin(float d1, float d2, float k){
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(h) / k;
}

// sphere
float sdSphere(vec3 p) {
  return length(p) - size;
}

// box
const float b = 0.75;
const float r = 0.05;
float udRoundBox(vec3 p) {
  return length(max(abs(p)-b,0.0))-r;
}

// torus
const vec2 t = vec2(0.75, 0.25);
float sdTorus(vec3 p) {
  // 横
  // vec2 q = vec2(length(p.xz) - t.x, p.y);
  // 縦
  vec2 q = vec2(length(p.xy) - t.x, p.z);
  return length(q)-t.y;
}

// floor
float sdFloor(vec3 p){
  return length(max(abs(p) - vec3(1.0, 0.1, 0.5), 0.0)) - 0.1;
}

// distanceFunc
float distanceFunc(vec3 p){

  // rotate
  vec3 r = rotate(p, radians(time * 10.0), vec3(1.0, 0.5, 0.0));

  // twist
  vec3 q = twist(p, sin(time * 2.0) * 10.0);

  float d1 = sdTorus(p);
  float d2 =
    sin(5.0 * p.x + (time * 0.2) * 12.0) *
    sin(5.0 * p.y + (time * 0.2) * 14.0) *
    sin(5.0 * p.z + (time * 0.2) * 16.0);
  return smoothMin(d1 + d2, d1, 2.0);

}

// getNormal
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

  // ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));

  // marching loop
	float distance = 0.0;
	float rLen = 0.0;
  vec3 cPos = vec3(0.0, 0.0, 3.0);
	vec3 rPos = cPos;
	for(int i = 0; i < 128; i++){
		distance = distanceFunc(rPos);
		rLen += distance;
		rPos = cPos + ray * rLen;
	}

  // 衝突判定
  if(abs(distance) < 0.001){

		// cPosから法線を取得
		vec3 normal = getNormal(rPos);
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);

		// レンダリング
    gl_FragColor = vec4(vec3(diff), 1.0);

  } else {

		// else部分は背景色
    gl_FragColor = vec4(vec3(0.0), 1.0);

  }

}
