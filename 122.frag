#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
uniform sampler2D cat1;
uniform sampler2D cat2;

float random (in vec2 _uv) {
  return fract(sin(dot(_uv.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 _uv)
{
  vec2 i = floor(_uv);
  vec2 f = fract(_uv);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5
float fbm ( in vec2 _uv)
{
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5),
                 -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(_uv);
    _uv = rot * _uv * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {

	// float t = exp(-1. * fract(time));
	// float t = exp(-1. * cos(time));
	// float t = mod(cos(time), 1.);
	float t = cos(time * 2.);
	float dispFactor = smoothstep(0., 1., t);
	float effectFactor = 1.;

	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

	vec2 pos1 = vec2(
		tUv.x - dispFactor * (fbm(tUv * 20.) * effectFactor),
		tUv.y - dispFactor * (fbm(tUv * 20.) * effectFactor)
	);

	vec2 pos2 = vec2(
		tUv.x + (1. - dispFactor) * (fbm(tUv * 20.) * effectFactor),
		tUv.y + (1. - dispFactor) * (fbm(tUv * 20.) * effectFactor)
	);

	vec4 _texture1 = texture2D(cat1, pos1);
	vec4 _texture2 = texture2D(cat2, pos2);

	vec4 destTexture = mix(_texture1, _texture2, dispFactor);

	gl_FragColor = destTexture;

}
