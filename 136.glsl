// https://qiita.com/aa_debdeb/items/03609566ea322a4b764f

float sdBox(vec2 p, vec2 s) {
	p = abs(p) - s;
	return length(max(p, 0.0)) + min(max(p.x, p.y), 0.0);
}

float sdCross(vec2 p) {
    p = abs(p);
    return min(p.x, p.y) - 1.0;
}

float sierpinskiCarpet(vec2 p) {
    float d = sdBox(p, vec2(1.));

    float s = 1.;
    for (int i = 0; i < 4; i++) {
        vec2 a = mod(p * s, 2.) - 1.;
        vec2 r = 1. - 3. * abs(a);
        s *= 3.;
        float c = sdCross(r) / s;
        d = max(d, c);
    }
    return d;
}

void mainImage(out vec4 fragColor, in vec2 p) {
    
    p *= 1.2;
    float d = sierpinskiCarpet(p);
    
    vec3 c = vec3(0.);

    if(d > 0.) {
        c = vec3(0.);
    } else {
        c = vec3(1.);
    }
    
    fragColor = vec4(c, 1.);

}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}