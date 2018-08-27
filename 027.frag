#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 color = vec3(0.0, 0.0, 0.0);
  for(float i = 0.0; i < 12.0; i++){
    p.y += sin(p.x * 4.0 + time * 2.0 + i * 40.0) * 0.2 * cos(time + (i + 2.0) * 300.0);
    color += (1.0 - vec3(pow(abs(p.y), 0.03)));
  }

  float r = color.r * 1.0;
  float g = color.g * 1.0;
  float b = color.b * 1.0;
  vec3 dest = vec3(r, g, b);

  gl_FragColor = vec4(dest, 1.0);
}
