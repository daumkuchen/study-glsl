#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

		// p *= floor(time * 10.0);

    float s = sin(time * 0.5);
    float c = cos(time * 0.25);
    vec2 q = mat2(c, s, -s, c) * p;
    vec2 v = mod(q * 1.0, 2.0) - 1.0;
    float r = sin(length(v) * 10.0 - time * 5.0);
    float g = sin(length(v) * 12.5 - time * 3.5);
    float b = sin(length(v) * 15.0 - time * 2.0);

		//r *= fract(time * 10.0);
		//g *= fract(time / 2.0);
		//b *= fract(time * 20.0);

    gl_FragColor = vec4(vec3(r, g, b), 1.0);
}

/*
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene texture

void main() {
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	// p *= fract(time * 4.0 / 2.0);

	float r = 0.3 / length(p + vec2(sin(time * 1.23) * 0.4, 0));
	float g = 0.3 / length(p + vec2(sin(time * 2.23) * 0.4, 0));
	float b = 0.3 / length(p + vec2(sin(time * 3.23) * 0.4, 0));

	gl_FragColor = vec4(vec3(r,g,b), 1);
}
*/
