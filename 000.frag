precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
