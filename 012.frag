precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

  // マウス座標の正規化
  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  // フラグメント座標の正規化
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float pos = step(0.0, sin(33.0 * position.x));

  gl_FragColor = vec4(vec3(pos),1.0);

}
