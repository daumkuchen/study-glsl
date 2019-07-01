#iChannel0 file://./_image/cat_01.jpg

float hash(in float n){
    return fract(sin(n)*43758.5453);
}

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6. - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0., 1.), s);
}

#define PI 3.1415926535897932384626433832795

void mainImage(out vec4 fragColor, in vec2 p) {

    float t = iTime * .4;

    // vec3 center = vec3(sin(iTime), 1., cos(iTime * .5));
    vec3 center = vec3(.5);
    
    vec3 pp = vec3(0.);
    vec2 pos = vec2(0., 0.);
    float l = 1.;

    float count = 64.;
    for( float i = 0.; i < count; i+=1. ){

        float an = sin(t * PI * .00001) - hash(i) * PI * 2.;
        // float an = hash(i) * PI * 2.;
        
        float ra = sqrt(hash(an)) * .5;

    	pos = vec2(
            center.x + cos(an) * ra,
            center.z + sin(an) * ra
        );

        float di = distance(p, pos);

        l = min(l, di);
        if(l == di){
            pp.xy = pos;
            pp.z = i / count * p.x * p.y;
        }

    }
    
    vec3 shade_color = vec3(max(0., dot(pp, center)));

    vec4 tex = texture2D(iChannel0, p);
    vec3 tex_color = tex.rgb;

    vec3 color = vec3(hsv(pp.r * pp.g, 1., 1.));

    fragColor = vec4(color, 1.);

}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);

    vec2 p = gl_FragCoord.xy / iResolution.xy;
    // p.x *= iResolution.x / iResolution.y;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}