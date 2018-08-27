#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){

  // resolution
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // mouse
  // vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);
  vec2 m = vec2(mouse.x, mouse.y);

	float l = length(p);
	float speed = 2.0;

	vec2 uv = gl_FragCoord.xy / resolution.xy + (p / l) * (cos(l * 12.0 - time * speed));
       uv += (cos(uv * 4.0 - time * 0.5) );
       uv *= 0.6;

  vec3 color = vec3(uv.x, uv.y * 0.8, uv.y * 2.5);

	gl_FragColor = vec4(color, 1.0);

}
