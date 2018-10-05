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

	vec2 uv = floor(5. * gl_FragCoord.xy * vec2(resolution.x / resolution.y, 1.) / resolution.xy);
	float q = mod(uv.x + uv.y, 2.);

	vec3 dest = vec3(q);
	gl_FragColor = vec4(dest, 1.);

}
