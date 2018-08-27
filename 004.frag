#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){

  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  // orb
  // float orb = 0.05 / length(vec2(p));
  // gl_FragColor = vec4(vec3(orb), 1.0);

  // ring
  // float ring = 0.02 / abs(0.5 - length(p));
  // gl_FragColor = vec4(vec3(ring), 1.0);

  // zoom
  // float zoom = atan(p.y, p.x) + time;
  // zoom = sin(zoom * 10.0);
  // gl_FragColor = vec4(vec3(zoom), 1.0);

  // flower
  // float flower = sin((atan(p.y, p.x) + time * 0.5) * 6.0);
  // flower = 0.01 / abs(flower - length(p));
  // gl_FragColor = vec4(vec3(flower), 1.0);

  // fan
  // float fan = abs(sin((atan(p.y, p.x) - length(p) + time) * 10.0) * 0.5) + 0.2;
  // fan = 0.01 / abs(fan - length(p));
  // gl_FragColor = vec4(vec3(fan), 1.0);

  // noisering
  float noisering = sin((atan(p.y, p.x) + time * 0.5) * 20.0) * 0.01;
  noisering = 0.01 / abs(0.5 + noisering - length(p));
  gl_FragColor = vec4(vec3(noisering), 1.0);

}
