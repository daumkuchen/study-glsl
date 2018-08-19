#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void){

  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float pos = step(0.0, sin(33.0 * p.x));

  gl_FragColor = vec4(vec3(pos),1.0);

}
