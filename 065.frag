#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

vec2 tex(vec2 uv){
    return texture2D(backbuffer, uv).xy - 0.5;
}

void main( void ){

  // vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / resolution.x - mouse.xy + 0.5;

  vec2 pos = (gl_FragCoord.xy * 2.0 - resolution);
       pos /= min(resolution.x, resolution.y);
       // pos /= vec2(mouse.x, mouse.y);
       // pos /= resolution.y - mouse.xy + 0.5;

  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0) * 10.;

  vec2 uv =  (gl_FragCoord.xy / resolution.xy);
  vec2 prev = tex(uv);
  vec2 pixel = 2. / resolution;

  // ラプラシアンフィルタで加速度を計算
  float accel =
      tex(uv + pixel * vec2(1, 0)).x +
      tex(uv - pixel * vec2(1, 0)).x +
      tex(uv + pixel * vec2(0, 1)).x +
      tex(uv - pixel * vec2(0, 1)).x -
      prev.x * 4.;

  // 伝播速度を掛ける
  accel *= .2;

  // 現在の速度に加速度を足し、さらに減衰率を掛ける
  float velocity = (prev.y + accel) * 0.95;

  // 高さを更新
  float height = prev.x + velocity;

  // マウス位置に波紋を出す
  // height += max(0., 1. - length(pos) * 30.) + .5;

  // これはこれでかっこいい
  height += max(0., 1. - length(pos * mouse) * 30.) + .5;

  gl_FragColor = vec4(height, velocity + .5, 0., 1.);

}
