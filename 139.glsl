vec3 rotate(vec3 p,vec3 n,float a) {
    n=normalize(n);
    vec3 v = cross(p,n=normalize(n));
    return cross(v,n)*cos(a)+v*sin(a)+n*dot(p,n);   
}

mat2 rotate(float a) {
    return mat2(cos(a), sin(a), -sin(a), cos(a));    
}

float map(vec3 p) {
    vec3 u = floor(p / 6.);
    u = sin(11. * (2.5 * u + 3. * u.yzx + 1.345));
    p = mod(p, 6.) - 3.;
    p = rotate(p, u, iTime);
    if (dot(u, u.yxz) > 0.) return 1.;
    float w = abs(length(p.xz) - 1.) - .2;
    vec2 d = vec2(w, abs(p.y) - (.7 + .2 * sin(iTime)));
    return length(max(d, 0.)) - .1;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1,-1)*0.02;
    return normalize(
        e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+ 
        e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));
}

void mainImage(out vec4 fragColor, in vec2 p) {

    vec3 ro = vec3(0., 4., 8.);
    ro.xz *= rotate(iTime * .1);
    vec3 ta =vec3(rotate(iTime * .1) * vec2(1., 0.), 2. * sin(iTime * .3));
    vec3 w = normalize(ta - ro);
    vec3 u = cross(w, vec3(0., 1., 0.));
    vec3 rd = mat3(u, cross(u, w), w) * normalize(vec3(p, 2.));
    vec3 col = vec3(0.);
    vec3 pos = ro;
    float d = 0.;
    float i = 0.;
    float t = 0.;

    for (i = 1.; i > 0.; i -= 1. / 150.) {
        t += d = map(pos) * .3;
        if(d < .001) break;
        pos += rd * d;
    }

    col += vec3(.4, .8, 0.) * min(1., .005 / (d * d));

    if(d < .01){
        col = vec3(.4, .8, 0.);
        vec3 l = vec3(.577);
        vec3 n = calcNormal(pos);
        col *= max(.2, dot(n, l));
        col *= max(.5 + .5 * n.y, 0.);    
        col *= i * i * i * 2.;
        col *= exp(-t * t * .005);
        col = pow(col, vec3(.8));
    }

    fragColor = vec4(col, 1);

}

void main(){

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}