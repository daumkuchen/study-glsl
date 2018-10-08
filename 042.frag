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
const float size = 0.75;
const vec3 lightDir = vec3(-0.5, 0.5, 0.5);

// sphere
float sdSphere(vec3 p) {
  return length(p) - size;
}

// distanceFunc
float distanceFunc(vec3 p){
	return sdSphere(p);
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

	vec3 color = vec3(0.0, 0.0, 0.0);

  // 衝突判定
  if(abs(distance) < 0.001){

		// cPosから法線を取得
		vec3 normal = getNormal(rPos);
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);

		// レンダリング
    // gl_FragColor = vec4(vec3(diff), 1.0);
		color += vec3(diff);

  } else {

		// else部分は背景色
    // gl_FragColor = vec4(vec3(0.0), 1.0);
		color += vec3(0.0);
  }

	float horizon = 0.0;
  float fov = 1.0;
  float scale = 0.1;
  vec3 position = vec3(p.x, fov, p.y - horizon);
  vec2 s = vec2(position.x / position.z, position.y / position.z) * scale;
  float floor = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));
        floor *= position.z * position.z * position.z;

	color = vec3(mod(floor + color.r * 1.5, 0.0), mod(floor + color.g * 1.5, 0.0), mod(floor + color.b * 1.5, 0.0));
	gl_FragColor = vec4(color, 1.0);
}
