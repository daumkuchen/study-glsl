#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float posX1 = p.x + sin(time * 1.0) * 0.5;
  float posY1 = p.y + cos(time * 1.0) * 0.5;
  float posX2 = p.x + sin(time * 1.5) * 0.5;
  float posY2 = p.y + cos(time * 1.5) * 0.5;
  float posX3 = p.x + sin(time * 2.0) * 0.5;
  float posY3 = p.y + cos(time * 2.0) * 0.5;

  // float orb = 0.1 / length(mouse - p);
  // float orb = 0.1 / length(p);
  float orb1 = 0.05 / length(vec2(posX1, posY1));
  float orb2 = 0.05 / length(vec2(posX2, posY2));
  float orb3 = 0.05 / length(vec2(posX3, posY3));

  gl_FragColor = vec4(vec3(orb1 + orb2 + orb3), 1.0);

}
