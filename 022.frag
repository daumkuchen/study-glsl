#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float s = sin(time * 0.5);
    float c = cos(time * 0.25);
    vec2 q = mat2(c, s, -s, c) * p;
    vec2 v = mod(q * 1.0, 2.0) - 1.0;
    float r = sin(length(v) * 10.0 - time * 5.0);
    float g = sin(length(v) * 12.5 - time * 3.5);
    float b = sin(length(v) * 15.0 - time * 2.0);
    gl_FragColor = vec4(vec3(r, g, b), 1.0);
}
