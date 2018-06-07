#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

// distance function
float distanceSphere(vec3 ray){
	float dist = length(ray) - 1.0;
	return dist;
}

// repetition distance function
float repetitionSphere(vec3 ray){
	float dist = length(mod(ray, 2.0) - 1.0) - 0.25;
	return dist;
}

// distance hub
float distanceHub(vec3 ray){
	return repetitionSphere(ray);
}

// generate normal
vec3 genNormal(vec3 ray){
  float d = 0.001;
  return normalize(vec3(
	  distanceHub(ray + vec3(  d, 0.0, 0.0)) - distanceHub(ray + vec3( -d, 0.0, 0.0)),
	  distanceHub(ray + vec3(0.0,   d, 0.0)) - distanceHub(ray + vec3(0.0,  -d, 0.0)),
	  distanceHub(ray + vec3(0.0, 0.0,   d)) - distanceHub(ray + vec3(0.0, 0.0,  -d))
  ));
}

void main(){

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // ray direction
    vec3 dir = normalize(vec3(p, -1.0));

    // origin p
		// レイの原点
    vec3 origin = vec3(0.0, 0.0, 3.0 - time);

    // marching loop
		// rayの初期位置はorigin
    vec3 ray = origin;
		float dist = 0.0;
    for(int i = 0; i < 32; ++i){
			dist = distanceHub(ray);
    	ray += dir * dist;
    }

    // distance check
		vec3 normal = vec3(0.0);
		if(dist < 0.001){
			normal = genNormal(ray);
		}

		gl_FragColor = vec4(normal, 1.0);
}
