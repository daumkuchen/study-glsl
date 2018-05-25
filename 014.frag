precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// foked http://glslsandbox.com/e#47147.0

#define N .45

void main(void) {

  vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  // float ring = 0.01 / abs(0.5 - length(p));

  float sphere = 512.0 / length(p);
  // sphere = floor(sphere);

  sphere = fract(sphere - (time * 0.1));

	gl_FragColor = vec4(vec3(sphere, 0.5, 1.0), 1.0);

}
