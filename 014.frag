precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// foked http://glslsandbox.com/e#47147.0

#define N .45

void main(void) {

  vec2 v = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	gl_FragColor = vec4(vec3(1.0), 1.0);

}
