#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

float map(
		float value,
		float beforeMin,
		float beforeMax,
		float afterMin,
		float afterMax
	) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

void main()
{
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	uv *= rotate2d(time * 0.25);
	// uv *= rotate2d(0.0);

	float scale = 10.0;
  vec2 repeatedUv = uv * scale;
  vec2 newUv = fract(repeatedUv);

  vec2 center = floor(repeatedUv) + vec2(0.5, 0.5);
  float dist = distance(center, vec2(0.0));
  dist /= scale;

  vec3 color = vec3(0, 0, 0) /* * sin(time * 1.0) */;

  float offset = map(sin(time * 3.0), -1.0, 1.0, 0.6, 0.9);

  if (dist < offset) {
    newUv -= 0.5;

    float radius = 0.4;
    float dist = length(uv);
    float deg = atan(uv.y, uv.x);

		newUv *= rotate2d(-deg);

		float circle = 1.0 - step(radius, length(vec2(newUv.x * (1.0 + (dist * 2.0)), newUv.y)));
    color.rgb += circle;

    newUv += 0.5;

  }

	gl_FragColor = vec4(color, 1.0);

}
