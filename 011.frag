#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

  // マウス座標の正規化
  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  // フラグメント座標の正規化
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float pos1 = step(1.0 * sin(time * 4.0), 1.0 - position.x) * 0.8;
  float pos2 = step(1.0 * cos(time * 3.0),       position.x) * 0.8;
  float pos3 = step(1.0 * sin(time * 2.0), 1.0 - position.x) * step(-1.0 * cos(time * 2.0), position.x) * 0.8;

  gl_FragColor = vec4(vec3(pos1 + pos3, pos1 + pos2, pos2 + pos3),1.0);

}
