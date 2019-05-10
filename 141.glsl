#iChannel0 file://./_image/cat_01.jpg

void mainImage(out vec4 fragColor, in vec2 p) {

    // vec2 pos = p * abs(sin(iTime)) * 8.;
    vec2 pos = p * 4.;
    vec4 tex = texture2D(iChannel0, pos);
    fragColor = tex;
    
}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    // vec2 p = gl_FragCoord.xy / iResolution.xy;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}