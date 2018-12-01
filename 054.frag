#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

vec2 random2(vec2 p){
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float random(in vec2 st){
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main()
{

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
       p *= 5.0;

  vec3 color = vec3(0.5);

  vec2 i_st = floor(p);
  vec2 f_st = fract(p);

  float m_dist = 1.0;

  for (int y= -1; y <= 1; y++){
    for (int x= -1; x <= 1; x++){

      vec2 neighbor = vec2(float(x), float(y));

      vec2 point = random2(i_st + neighbor);
           point = 0.5 + 0.5 * cos((time * 4.0) * point);

      vec2 diff = neighbor + point - f_st;

      float dist = length(diff);

      m_dist = min(m_dist, dist);
    }
  }

  color += m_dist;
  color += 1.0 - step(0.001, m_dist);
  color.r += step(1.0, f_st.x) + step(1.0, f_st.y);

  float r = 1.0 - color.r * abs(m_dist * 1.2) / 0.05 + 1.0;
  float g = 1.0 - color.g * abs(m_dist * 1.2) / 0.05 + 1.0;
  float b = 1.0 - color.b * abs(m_dist * 1.2) / 0.05 + 1.0;

  vec3 c = vec3(r, g, b);
  vec4 dest = vec4(c, 1.0);

  gl_FragColor = vec4(dest);

  // if(distance(p, c.xy) < 10.0){
  //   gl_FragColor = vec4(dest);
  // } else {
  //   gl_FragColor = texture2D(backbuffer, p) * 1.0;
  // }

}
