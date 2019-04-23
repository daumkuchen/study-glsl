#define PI 3.141592654

float random (in vec2 _st){
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void mainImage(out vec4 fragColor, in vec2 p) {

    // p *= .4 + sin(iTime * .5) * .1;
    
    vec3 col = vec3(0.);

    vec2 pos = p;
    // vec2 pos = p + (p * sin(iTime) * .01);
    // pos *= rot(iTime * .5);
    // pos *= rot(PI * random(vec2(iTime)));
    pos *= rot(PI/2.);
    
    for (float i = 0.; i < 6.; i++) {

        pos = abs(2. * fract(pos - .5) - 1.);
        
        float t = random(vec2(iTime));

        mat2 mat = rot(pos.y * sin(t));
        // mat2 mat = rot(pos.y);
        pos *= mat;
        
        col += exp(-abs(pos.x) * 15.);
    }
    
    fragColor = vec4(col, 1.);

}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}