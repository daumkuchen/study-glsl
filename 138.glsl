vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6. - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0., 1.), s);
}

void mainImage(out vec4 fragColor, in vec2 p) {

    int j = 0;
    vec2 x = vec2(-.345, .645);
    vec2 y = vec2(iTime * .001, 0.);
    vec2 z = p;

    for(int i = 0; i < 360; i++){
        j++;
        if(length(z) > 2.){
            break;
        }
        // Zn+1 = Zn2 + C
        // &&
        // Z0 = 0
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + x + y;
    }
    
    float h = abs(mod(iTime * 15. - float(j), 360.) / 360.);
    vec3 rgb = hsv(h, 1., 1.);
    fragColor = vec4(rgb, 1.);
    
}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}