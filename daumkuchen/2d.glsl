#define PI 3.141592
#define TAU (PI*2.0)
#define RATIO .125

mat2 rot(float th) {
    vec2 a = sin(vec2(1.570796, 0.) + th);
    return mat2(a, -a.y, a.x);
}

float sdCircle( vec2 p, float r ) {
    return length(p) - r;
}

float sdPlane( vec3 p, vec4 n ) {
    return dot(p, n.xyz) + n.w;
}

float sdRect(vec2 p, vec2 t, vec2 b) {
	vec2 d = abs(p-t)-b;
    return min(max(d.x, d.y), 0.) + length(max(d, 0.));
}

float sdBody(vec2 p) {
    return sdCircle(p, 1. - RATIO * 2.);
}

float sdEye1(vec2 p) {
    return sdCircle(p , 1. - RATIO * 4.);
}

float sdEye2(vec2 p) {
    return sdCircle(p , 1. - RATIO * 6.);
}

float sdEyelid1(vec2 p) {
    return sdCircle(vec2(p.x, p.y + floor(p.y)) , 1. - RATIO * 4.);
}

float sdEyelid2(vec2 p) {
    return sdRect(
        vec2(p.x, p.y),
        vec2(0., RATIO),
    	vec2(.55, RATIO)
    );
}

void mainImage(out vec4 fragColor, in vec2 p) {

    p *= rot(iTime * .8);
    
    vec3 col;
    vec3 colBlack = vec3(0., 0., 0.);
    vec3 colWhite = vec3(1., 1., 1.);
    vec3 colYellow = vec3(.9411, .8627, .1568);

    float ss = 3. / min(iResolution.x, iResolution.y);

    col = colYellow;
    col = mix(col, colBlack, smoothstep(ss, 0., sdBody(p)));
    col = mix(col, colWhite, smoothstep(ss, 0., sdEye1(p)));
    col = mix(col, colBlack, smoothstep(ss, 0., sdEye2(p)));
    col = mix(col, colYellow, smoothstep(ss, 0., sdEyelid1(p)));
    col = mix(col, colBlack, smoothstep(ss, 0., sdEyelid2(p)));

    fragColor = vec4(col, 1.);

}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}