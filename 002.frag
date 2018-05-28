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

  // XとYを別に取り出し、各座標系に変化を追加する
  float posX = position.x + sin(time * 2.0) * 0.5;
  float posY = position.y + cos(time * 2.0) * 0.5;

  // 座標をマウス追従
  // float orb = 0.1 / length(mouse - position);

  // 座標を中央に固定
  // float orb = 0.1 / length(position);
  float orb = 0.1 / length(vec2(posX, posY));

  gl_FragColor = vec4(vec3(orb), 1.0);

}
