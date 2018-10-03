#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const int count = 128;

float rnd(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

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
    float x = uv.x + sin(time * fi + 1.) * .2;
    float y = uv.y + cos(time * fi + 1.) * .2;
    c -= smoothstep(1., .2, sdSphere(vec2(x, y)) * 2.);
  }

  float a = .5;
  vec3 color = vec3(c, c + a, c);

	gl_FragColor = vec4(color, 1.0);

}
