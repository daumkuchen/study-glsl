#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float PI = 3.1415926;
const float TWO_PI = 2. * PI;

const float s = 25.;
const float invs = 1. / s;
const vec3 color = vec3(1., 1., 1.);

float random(vec2 seed)
{
  return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float m(vec2 uv, float t)
{
	vec2  suv   = uv*s;
	vec2  fuv   = fract(suv)-0.5;
	vec2  isuv  = floor(suv);
	float result = 0.0;
	for(int x = -1; x <= 1; ++x)
	{
		for(int y = -1; y <= 1; ++y)
		{
			vec2 pixuv = (isuv-vec2(float(x), float(y)))*invs;
			result += sin((random(pixuv)*TWO_PI+t));
		}
	}
	// result *= 0.1111111;
	return (1.0-length(fuv))*result;
}

void main(void) {

	vec2 uv = (gl_FragCoord.xy * 2. -resolution.xy) / min(resolution.x, resolution.y);
	vec2 luv = gl_FragCoord.xy / resolution.xy - 0.5;

	float t = fract(time * .5) * TWO_PI;
	vec3 result = vec3(
    m(uv, t),
    m(uv - luv * .03, t),
    m(uv - luv * .02, t)
  );

	result *= color;

	gl_FragColor = vec4(result, 1.
    );

}
