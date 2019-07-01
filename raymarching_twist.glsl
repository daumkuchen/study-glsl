precision highp float;

uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D backbuffer;

const vec3 light_pos = vec3(.5, .5, -.5);

const float PI = acos(-1.);
const float PI2 = PI * 2.;

vec3 foldX(vec3 p) {
    p.x = abs(p.x);
    return p;
}

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}
mat3 rotX(float a){
	float s = sin(a);
	float c = cos(a);
	return mat3(
		1, 0, 0,
		0, c, -s,
		0, s, c
	);
}

mat3 rotY(float a){
	float s = sin(a);
	float c = cos(a);
	return mat3(
		c, 0, -s,
		0, 1, 0,
		s, 0, c
	);
}

mat3 rotZ(float a){
	float s = sin(a);
	float c = cos(a);
	return mat3(
		c, -s, 0,
		s, c, 0,
		0,0, 1
	);
}

vec2 pmod(vec2 p, float r) {
    float a =  atan(p.x, p.y) + PI / r;
    float n = PI2 / r;
    a = floor(a / n) * n;
    return p * rot2(-a);
}


float sdSphere(vec3 p, float s){
	return length(p) - s;
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d,0.0))
			+ min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdTorus(vec3 p, vec2 t){
	vec2 q = vec2(length(p.xz)-t.x,p.y);
  	return length(q)-t.y;
}

vec3 opTwist(in vec3 p, float k){
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2 m = mat2(c,-s,s,c);
    vec3 q = vec3(m*p.xz,p.y);
    return q;
}

float map(vec3 p){

	// p.xy *= rot2(time);
	// p.yz *= rot2(time);
	// p.yz *= rot2(PI * .5);

	vec3 twist = opTwist(p, sin(time) * 3.);

	float torus = sdTorus(twist, vec2(1., .5));
	float d = torus;

	return d;

}

vec3 calcNormal(vec3 p){
    float d = .0001;
    return normalize(vec3(
        map(p + vec3(  d, 0.0, 0.0)) - map(p + vec3( -d, 0.0, 0.0)),
        map(p + vec3(0.0,   d, 0.0)) - map(p + vec3(0.0,  -d, 0.0)),
        map(p + vec3(0.0, 0.0,   d)) - map(p + vec3(0.0, 0.0,  -d))
    ));
}

float calcAO(in vec3 pos, in vec3 nor){
	float occ = 0.;
    float sca = 1.;
    for(int i = 0; i < 5; i++){
        float hr = .01 + .12 * float(i) / 4.;
        vec3 aopos = nor * hr + pos;
        // float dd = map(aopos).x;
		float dd = map(aopos);
        occ += -(dd - hr) * sca;
        sca *= .95;
    }
    return clamp(1. - 3. * occ, 0., 1.) * (.5 + .5 * nor.y);
}

vec3 render(vec3 c_pos, vec3 ray_dir){
    
    float depth = 1.;
    
    vec3 col = vec3(0.);
    
    for(int i = 0; i < 64; i++){
        
        vec3 ray = c_pos + ray_dir * depth;
        float dist = map(ray);
        
        if(abs(dist) < .0001){

			vec3 normal = calcNormal(ray);
			float ao = calcAO(ray, normal);
        	float diff = clamp(dot(light_pos, normal), .1, 1.);
            col = vec3(diff + ao);
            break;

        } else {

			vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
			float vignette = (1. - length(p * .5)) * .1;
			col = vec3(vignette);

		}
        
        depth += dist;
        
    }
    
    return col;
    
}

void main(){

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
    
    vec3 c_pos = vec3(0., 0., -3.);
	vec3 c_dir = vec3(0., 0., -1.);
	vec3 c_up = vec3(0., 1., 0.);
	vec3 c_side = cross(c_dir, c_up);
    
	vec3 ray_dir = normalize(vec3(p, 1.));
    vec3 col = render(c_pos, ray_dir);
    
    gl_FragColor = vec4(col, 1.);
    
}