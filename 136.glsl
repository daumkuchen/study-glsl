#ifdef GL_ES
precision mediump float;
#endif

#define SHADERTOY 1
#define PI 3.141592654
// #define saturate(a) clamp(a, 0., 1.)
#define range(a, b) (step(a, floor(time2)) * step(floor(time2), b))
// const float PI = 3.14159265;
const float angle = 60.;
const float fov = angle * .5 / PI / 180.;
const vec3 lightDir = normalize(vec3(-.5, .5, .5));
const vec3 ambient = vec3(.05, .05, .05);
const int maxIteration = 128;
const float fmaxIteration = float(maxIteration);

float time0, time1, time2, zoom, a;
int iter;

float box(vec3 p, float b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

vec3 hue(float hue) {
    vec3 rgb = fract(hue + vec3(0., 2. / 3., 1. / 3.));
    rgb = abs(rgb * 2. - 1.);
    return clamp(rgb * 3. - 1., 0., 1.);
}

float hash11(float p) {
    vec3 p3 = fract(vec3(p) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot1, rot2, rot3, rot4;

vec2 ifs(vec3 p){
    float d1 = 999.;
    float d2 = 999.;
    float range = .8;
    float radius = .5 * (1. + zoom);
    const float maxIter = 8.;
    for (int i = int(maxIter); i > 0; i--) {
        if (i <= iter) {
            break;
        }

        float ratio = float(i) / maxIter;
        float bx = box(p, radius * ratio);
        d1 = mix(d1, min(d1, bx), float(i > iter + 1));
        d2 = min(d2, bx);

        ratio *= ratio;

        p.xz = abs(p.xz) - range * ratio * .7;
        p.xz *= rot1;
        p.yz *= rot3;
        p.yx *= rot2;

        p.yz = abs(p.yz) - range * ratio * .7;
        p.xz *= rot1;
        p.yz *= rot4;
        p.yx *= rot2;
    }
    return vec2(d1, d2);
}

mat3 rotate(vec3 axis, float rad) {
    float hr = rad / 2.0;
    float s = sin( hr );
    vec4 q = vec4(axis * s, cos( hr ));
    vec3 q2 = q.xyz + q.xyz;
    vec3 qq2 = q.xyz * q2;
    vec2 qx = q.xx * q2.yz;
    float qy = q.y * q2.z;
    vec3 qw = q.w * q2.xyz;

    return mat3(
        1.0 - (qq2.y + qq2.z),  qx.x - qw.z,            qx.y + qw.y,
        qx.x + qw.z,            1.0 - (qq2.x + qq2.z),  qy - qw.x,
        qx.y - qw.y,            qy + qw.x,              1.0 - (qq2.x + qq2.y)
    );
}

vec3 trans(vec3 p, float c){
    return mod(p, c) - (c * .5);
}

vec3 twist(vec3 p, float power){
    float s = sin(power * p.y);
    float c = cos(power * p.y);
    mat3 m = mat3(
        c, 0.0,  -s,
    0.0, 1.0, 0.0,
        s, 0.0,   c
    );
    return m * p;
}

vec3 cheapBend(vec3 p, float power){
    float s = sin(power * p.y);
    float c = cos(power * p.y);
    // mat3 m = mat3(
    //     c, 0.0,  -s,
    //   0.0, 1.0, 0.0,
    //     s, 0.0,   c
    // );
    // return m * p;
    mat2 m = mat2(c,-s,s,c);
    vec3 q = vec3(m*p.xy,p.z);
    return q;
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

float sdSphere(vec3 p, float s){
    return length(p) - s;
}

float sdTorus(vec3 p, vec2 t){
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q)-t.y;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return length(max(d,0.0))
    + min(max(d.x,max(d.y,d.z)),0.0);
}

float distanceFunc(vec3 p){

    // vec3 r = rotate(vec3(1., 1., 0.), sin(iTime), vec3(1., 1., sin(iTime)));

    // mat3 r = rotate(vec3(.2, .2, .2), 1.);
    // p = p * r;

    vec2 ifs = ifs(p);

    float sphere = sdSphere(p, 1.5);
    float torus = sdTorus(p, vec2(1., .5));
    // float box = sdBox(vec3(p.xy * ifs, p.z), vec3(1., 1., 1.));
    float box = sdBox(p, vec3(1., 1., 1.));

    return box;

    // return mix(d.y, d.x, mix(a, 1. - a, step(time0, 5.5)));

}

vec3 getNormal(vec3 p){
    float d = .0001;
    return normalize(vec3(
        distanceFunc(p + vec3( d, .0, .0)) - distanceFunc(p + vec3(-d, .0, .0)),
        distanceFunc(p + vec3(.0,  d, .0)) - distanceFunc(p + vec3(.0, -d, .0)),
        distanceFunc(p + vec3(.0, .0,  d)) - distanceFunc(p + vec3(.0, .0, -d))
    ));
}

void mainImage(out vec4 fragColor, in vec2 p) {

    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));

    mat3 r = rotate(vec3(0., 1., 0.), iTime);

    float d = .0;
    float rLen = .0;

    vec3 cPos = vec3(.0, .0, 40.);
    vec3 rPos = cPos;

    for(int i = 0; i < 128; i++){
        d = distanceFunc(rPos);
        rLen += d;
        rPos = cPos + ray * rLen;
        rPos *= r;
    }

    if(abs(d) < .0001){

        vec3 normal = getNormal(rPos);

        // lambert
        // float diffuse = clamp(dot(lightDir, normal), .1, 1.);

        float diffuse = max(dot(lightDir, normal), 0.);
        float specular = max(dot(normal, lightDir), 0.);
        specular = pow(specular, 12.) * .8;

        vec3 ambientColor = min(ambient + diffuse, 1.);

        vec3 color = vec3(1. - p, 1.);

        vec3 dest = (color * ambientColor) + vec3(specular);

        fragColor = vec4(dest, 1.);

    } else {

        vec3 color = vec3(0.);

        // float vignette = length(p);
        // color *= vignette;

        fragColor = vec4(color, 1.);

    }

}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy);
    p /= min(iResolution.x, iResolution.y);

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;


}