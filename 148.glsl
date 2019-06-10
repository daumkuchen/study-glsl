void mainImage(out vec4 fragColor, in vec2 p) {

    // float t = iTime;
    float t = .75;

    vec3 col = sin(p.x * 3.) * .5 + sin(p.y * 8. * t) * .5 * sin(t + p.xyx + vec3(0., 2., 4.));
    fragColor = vec4(col, 1.);
    
}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 p = gl_FragCoord.xy / iResolution.xy;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}