
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6. - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0., 1.), s);
}

vec2 collapseUV(vec2 p, float t) {
    float s = sin(t);
    float c = cos(t);
    vec2 pos = abs(p * 1.5) - 1.;
    pos *= mat2(c, s, -s, c);
    return pos;
}

vec2 repeatUV(vec2 p, float power) {
    vec2 pos = p * power;
    pos = mod(pos, 1.);
    return pos;
}

vec2 fractUV(vec2 p, float power) {
    vec2 pos = mod(abs(p), power);
    return pos;
}

void mainImage(out vec4 fragColor, in vec2 p) {


    // collapse
    // p = collapseUV(p, iTime);
    // p = collapseUV(p, iTime);
    // p = collapseUV(p, iTime);
    // p = collapseUV(p, iTime);
    // float l = 1. - length(p);


    // normal repeat
    // p = repeatUV(p, 5.);
    // float l = 1. - length(p * 2. - 1.);


    // fract
    p = fractUV(p, .5);
    float l = 1. - length(p * 2.);


    float ss = 3. / min(iResolution.x, iResolution.y);
    l = smoothstep(0., ss, l);
    
    // vec3 rgb = vec3(l);
    vec3 rgb = hsv(l, l, 1.);

    fragColor = vec4(rgb, 1.);
    
}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}