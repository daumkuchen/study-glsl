#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const int count = 32;

float sdSphere(vec2 p)
{
  return length(p);
}

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);

  float c = 1.;
  for(int i = 0; i < count; i++)
  {
    float fi = float(i);
    float x = uv.x + 1.5 - fi * .1;
    float y = uv.y + cos(time * 2. + fi) * .25;
    c -= smoothstep(1., .5, sdSphere(vec2(x, y)) * 30.);
  }
  vec3 color = vec3(c);

	gl_FragColor = vec4(color, 1.0);

}
