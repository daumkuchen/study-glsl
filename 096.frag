#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const int count = 128;

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
    float x = uv.x + sin(time * fi * .002) * .75;
    float y = uv.y + cos(time * fi * .002) * .75;
    c -= smoothstep(1., .5, sdSphere(vec2(x, y)) * 10.) * .2;
  }
  vec3 color = vec3(c);

	gl_FragColor = vec4(color, 1.0);

}
