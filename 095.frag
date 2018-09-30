#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const int count = 7;

float sdSphere(vec2 p)
{
  return length(p);
}

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);

  float c = 0.;
  for(int i = 0; i < count; i++)
  {
    float fi = float(i);
    c += smoothstep(1., .99, sdSphere(vec2(uv.x + 1.5 - fi * .5, uv.y + cos(time * 2. + fi) * .5)) * 10.);
  }
  vec3 color = vec3(c);

	gl_FragColor = vec4(color, 1.0);

}
