#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
uniform sampler2D cat1;
uniform sampler2D cat2;

void main() {

	// float t = exp(-1. * fract(time));
	// float t = exp(-1. * cos(time));
	// float t = mod(cos(time), 1.);
	float t = cos(time * 2.);
	float dispFactor = smoothstep(0., 1., t);
	float effectFactor = 1.;

  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  for(float i = 1.0; i < 10.0; i++) {
    uv.x += 0.3 / i * sin(i * 3.0 * uv.y + (time * 0.1) + cos((time / (10.0 * i)) * i));
    uv.y += 0.4 / i * cos(i * 3.0 * uv.x + (time * 0.5) + sin((time / (20.0 * i)) * i));
  }

	vec2 pos1 = vec2(
		tUv.x - dispFactor * (uv.x * effectFactor),
		tUv.y - dispFactor * (uv.y * effectFactor)
	);

	vec2 pos2 = vec2(
		tUv.x + (1. - dispFactor) * (uv.x * effectFactor),
		tUv.y + (1. - dispFactor) * (uv.y * effectFactor)
	);

	vec4 _texture1 = texture2D(cat1, pos1);
	vec4 _texture2 = texture2D(cat2, pos2);

	vec4 destTexture = mix(_texture1, _texture2, dispFactor);

	gl_FragColor = destTexture;

}
