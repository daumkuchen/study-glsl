#ifdef GL_ES
precision mediump float;
#endif

// https://wgld.org/d/webgl/w087.html
#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main()
{

  vec4 uv = vec4((gl_FragCoord.xy * 2. - resolution.xy) / resolution.y, 0., 1.);
  vec4 r = uv - uv;
  vec4 q = r;
  vec4 c;

  float t = time * .1;
  float k = 0.;

  // many params here
  k = .3;

  q.w += t * 4.16913 + 1.;

  // i is the color of pixel while hit 0. => 1.
	for (float i = 1.; i > 0.; i -= .01)
	{

    float d = 0.;
    float s = 1.;

    for (int j = 0; j < 3; j++)
		{
			r = abs(mod(q * s + (1. - .5 * (.5 * sin(t * .30392))), 2.) - 1.);
      d = max(d, (k - length(sqrt(r * .5536)) * .3) / s);
			s *= 3.;
		}

    q += 3. * abs(sin(t * 23. + .5 * cos(fract(sin(t * 5.2989))))) * uv * d;

    gl_FragColor = vec4(i);

    if(d < 1e-5) break;

  }

}
