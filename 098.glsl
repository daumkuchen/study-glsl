#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float sphere(vec2 p)
{
	return length(p);
}

void main()
{

	vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);

	vec2 q1 = mod(vec2(uv.x), .4) - .2;
	vec2 q2 = mod(vec2(uv.y), .4) - .2;

	float c1 = float(step(q1, vec2(0.)));
	float c2 = float(step(q2, vec2(0.)));

	vec3 dest = vec3(c1 + c2) * .5;

	gl_FragColor = vec4(dest, 1.);

}
