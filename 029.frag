#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

vec2 random2(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main(void){

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 color = vec3(0.0);
  vec2 i_p = floor(p);
  vec2 f_p = fract(p);

  float m_dip = 1.0;
  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x),float(y));
      vec2 point = random2(i_p + neighbor);
      point = 0.5 + 0.5 * sin((time * 0.5) + 10.0 * point);
      vec2 diff = neighbor + point - f_p;
      float dip = length(diff);
      m_dip = min(m_dip, dip);
    }
  }

  color += m_dip;
  color += 1.0 - step(0.05, m_dip) * vec3(0.0, 1.0, 0.2);
  color -= mod(sin(4.0 * m_dip) * 1.0, 0.4) * vec3(1.0, 1.0, 2.0);
  gl_FragColor = vec4(color, 1.0);

}
