#iChannel0 file://./_image/cat_01.jpg

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

#define ANIMATE
vec3 voronoi( in vec2 x, float rnd ) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g )*rnd;
            #ifdef ANIMATE
            o = 0.5 + 0.5*sin( iTime + 6.2831*o );
            #endif
            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j=-2; j<=2; j++ ) {
        for (int i=-2; i<=2; i++ ) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2(n + g)*rnd;
            #ifdef ANIMATE
            o = 0.5 + 0.5*sin( iTime + 6.2831*o );
            #endif
            vec2 r = g + o - f;

            if( dot(mr-r,mr-r)>0.00001 )
            md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
        }
    }
    return vec3( md, mr );
}

void mainImage(out vec4 fragColor, in vec2 p) {

    vec3 color = vec3(0.);

    float d = dot(p - .5, p - .5);

    vec3 c = voronoi(10. * p, pow(d, .5));

    // borders
    color = mix(vec3(1.), color, smoothstep(.01, .02, c.x));
    // color = 1. - color;

    // feature points
    // float dd = length(c.yz);
    // color += vec3(1.) * (1. - smoothstep(0., .1, dd));

    vec4 tex = texture2D(iChannel0, p);
    vec3 tex_color = tex.rgb;

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