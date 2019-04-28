void mainImage(out vec4 fragColor, in vec2 p) {
    
    float t = iTime * 1.;

    vec2 f = vec2(0.);
    vec3 c = vec3(1.);
    float light = 0.;

    for (int i = 0; i < 8; i++) {
        float x = float(i);
        f = vec2(sin(t + (p.x * exp(x))));
        light += .02 / distance(p, f);
    }

    c *= light;
    fragColor = vec4(c, 1.);

}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}