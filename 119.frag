#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
uniform sampler2D cat1;
uniform sampler2D cat2;
uniform sampler2D disp;

void main() {

	// float t = exp(-1. * fract(time));
	// float t = exp(-1. * cos(time));
	// float t = mod(cos(time), 1.);
	float t = cos(time);
	float dispFactor = smoothstep(0., 1., t);
	float effectFactor = 1.;

	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

	vec4 disp = texture2D(disp, tUv);

	vec2 pos1 = vec2(
		tUv.x - dispFactor * (disp.r * effectFactor),
		tUv.y - dispFactor * (disp.r * effectFactor)
	);

	vec2 pos2 = vec2(
		tUv.x + (1. - dispFactor) * (disp.r * effectFactor),
		tUv.y + (1. - dispFactor) * (disp.r * effectFactor)
	);

	vec4 _texture1 = texture2D(cat1, pos1);
	vec4 _texture2 = texture2D(cat2, pos2);

	vec4 destTexture = mix(_texture1, _texture2, dispFactor);

	gl_FragColor = destTexture;

}
