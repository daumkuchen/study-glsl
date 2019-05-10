#iChannel0 file://./_image/cat_01.jpg

void mainImage(out vec4 fragColor, in vec2 p) {

    float s = sin(iTime) * .05;
    vec4 c0 = texture2D(iChannel0, p);
    vec4 c1 = texture2D(iChannel0, p - vec2(s, 0.));
    vec4 c2 = texture2D(iChannel0, p - vec2(0., s));

    fragColor = (c0 + c1 + c2) / 3.;
    
}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    // vec2 p = gl_FragCoord.xy / iResolution.xy;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}