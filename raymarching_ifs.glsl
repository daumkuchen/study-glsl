precision highp float;

uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;

const vec3 light_pos = vec3(.5, .5, -.5);

const float PI = acos(-1.);
const float PI2 = PI * 2.;

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 foldX(vec3 p) {
    p.x = abs(p.x);
    return p;
}

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float sdSphere(vec3 p, float s){
	return length(p) - s;
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d,0.0))
			+ min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdOctahedron( in vec3 p, in float s){
    p = abs(p);
    return (p.x+p.y+p.z-s)*0.57735027;
}

float map(vec3 p){

	float d = 1.;
	vec3 size = vec3(.4);

	for(int i = 0; i < 6; i++) {

		// p = foldX(p);
		// p.xz *= rot2(time * .26);
		// p.xz += .3;
    	// p.xy *= rot2(time * .81);
		// p.xy += .1;

		p = foldX(p);
		p.xz *= rot2(1. + time * .2);
		p.xz += .3;
    	p.xy *= rot2(1. + time * .4);
		p.xy += .1;

	}

	d = min(d, sdBox(p, size));
	//d = min(d, sdOctahedron(p, size.x));

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
        
        if(abs(dist) < .01){

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
    
	float posx = 0.;
	float posy = 0.;
	float posz = -3.;
    vec3 c_pos = vec3(posx, posy, posz);
	vec3 c_dir = vec3(0., 0., -1.);
	vec3 c_up = vec3(0., 1., 0.);
	vec3 c_side = cross(c_dir, c_up);
    
	vec3 ray_pos = c_pos;
	vec3 ray_dir = normalize(vec3(p, 1.));

    vec3 col = render(ray_pos, ray_dir);

	float r = random(gl_FragCoord.xy) * .1;
    col -= r;
    
    gl_FragColor = vec4(col, 1.);
    
}