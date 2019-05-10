#iChannel0 file://./_image/cat_01.jpg

void mainImage(out vec4 fragColor, in vec2 p) {

    if (p.x > .5) p.x = -p.x;
    vec4 tex = texture2D(iChannel0, p);
    fragColor = tex;

}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 p = gl_FragCoord.xy / iResolution.xy;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}