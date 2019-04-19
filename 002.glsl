#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main()
{

  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float posX = p.x + sin(time * 2.0) * 0.5;
  float posY = p.y + cos(time * 2.0) * 0.5;

  // float orb = 0.1 / length(mouse - p);
  // float orb = 0.1 / length(p);
  float orb = 0.1 / length(vec2(posX, posY));

  gl_FragColor = vec4(vec3(orb), 1.0);

}
