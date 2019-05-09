#iChannel0 file://./_image/cat_01.jpg

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 p) {

    p *= 10.;

    vec4 tex = texture2D(iChannel0, p);
    vec3 tex_color = tex.rgb;

    vec2 i_st = floor(p);
    vec2 f_st = fract(p);
    float m_dist = 1.;

    vec3 color = vec3(0.);
    vec2 neighbor = vec2(0.);
    vec2 point = vec2(0.);
    vec2 diff = vec2(0.);
    float dist = 0.;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {

            neighbor = vec2(float(x), float(y));

            point = random2(i_st + neighbor);
            point = .5 + (.5 * sin((iTime + 10./*初期値*/) * point));

            diff = neighbor + point - f_st;

            dist = distance(diff, vec2(0.));
            // dist = smoothstep(0., 1., dist);

            m_dist = min(m_dist, dist);

        }
    }

    color += vec3(m_dist);

    // show point
    // color += 1. - step(.02, m_dist);

    // show axis
    // color.r += step(.98, f_st.x) + step(.98, f_st.y);

    // show isolines
    // color -= step(.7, abs(sin(27.0 * m_dist))) * .5;

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