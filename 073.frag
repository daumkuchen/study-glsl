#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float num = 5.;

vec4 ball(float i, float j) {
	float x = resolution.x / 2. * (1. + cos(1. * time + (3. * i + 4. * j)));
	float y = resolution.y / 2. * (1. + sin(2. * time + (3. * i + 4. * j)));
	float size = 3. - 2. * sin(time);
	vec2 p = vec2(x, y);
	float dist = length(gl_FragCoord.xy - p);
	float intensity = pow(size / dist, 2.);

	vec4 color = vec4(0.);
	// color.r = 0.5 + cos(time * i);
	// color.g = 0.5 + sin(time * j);
	// color.b = 0.5 + sin(j);
  color.r = .5;
  color.g = .5;
  color.b = .5;

	return color * intensity;
}

void main() {

	vec4 color = vec4(0.0);
	for (float i = 0.; i < num; ++i) {
		for (float j = 0.; j < num; ++j) {
			color += ball(i, j);
		}
	}

  // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 uv = vec2(gl_FragCoord.xy / resolution);
	vec4 b = texture2D(backbuffer, uv) * 0.9;
	gl_FragColor = color + b;

}
