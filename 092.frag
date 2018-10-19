#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float PI  = 3.141592653589793;
const float PI2 = PI * 2.;

float lPolygon(vec2 p, int n)
{
  float a = atan(p.x,p.y)+PI;
  float r = PI2/float(n);
  return cos(floor(0.5+a/r)*r-a)*length(p);
}

float morphing(vec2 p)
{

  float t = time * 2.5;

  int pair = int(floor(mod(t, 3.)));

  float a = smoothstep(.2, .8, mod(t, 1.));

  if(pair == 0) return mix(lPolygon(p, 4), lPolygon(p, 6), a);
  if(pair == 1) return mix(lPolygon(p, 6), lPolygon(p, 8), a);
           else return mix(lPolygon(p, 8), lPolygon(p, 4), a);

}

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  float d = morphing(uv);
  vec3 color = mix(vec3(1.), vec3(0.), smoothstep(.49, .5, d));
  gl_FragColor = vec4(vec3(color), 1.);

}
