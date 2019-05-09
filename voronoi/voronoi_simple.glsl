#iChannel0 file://./_image/cat_01.jpg

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 p) {

    // float dist = distance(seeds[0], gl_FragCoord.xy);
    // vec3 color = colors[0];

    float dist = distance(vec2(0.), p);
    vec3 color = vec3(0.);

    for (int i = 1; i < 32; i++) {

        float current = distance(p, p);
        
        if (current < dist) {
            color = vec3(0., 1., 0.);
            dist = current;
        }

    }

    fragColor = vec4(color, 1.);

}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);

    vec2 p = gl_FragCoord.xy / iResolution.xy;
    p.x *= iResolution.x / iResolution.y;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}