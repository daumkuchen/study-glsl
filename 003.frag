precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

  // マウス座標の正規化
  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  // フラグメント座標の正規化
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  // XとYを別に取り出し、各座標系に変化を追加する
  float posX1 = position.x + sin(time * 1.0) * 0.5;
  float posY1 = position.y + cos(time * 1.0) * 0.5;
  float posX2 = position.x + sin(time * 1.5) * 0.5;
  float posY2 = position.y + cos(time * 1.5) * 0.5;
  float posX3 = position.x + sin(time * 2.0) * 0.5;
  float posY3 = position.y + cos(time * 2.0) * 0.5;

  // 座標をマウス追従
  // float orb = 0.1 / length(mouse - position);

  // 座標を中央に固定
  // float orb = 0.1 / length(position);
  float orb1 = 0.05 / length(vec2(posX1, posY1));
  float orb2 = 0.05 / length(vec2(posX2, posY2));
  float orb3 = 0.05 / length(vec2(posX3, posY3));

  gl_FragColor = vec4(vec3(orb1 + orb2 + orb3), 1.0);

}
