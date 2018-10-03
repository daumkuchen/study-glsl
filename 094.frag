#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const int count = 32;

void main()
{

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);


  // background
	// vec3 color = vec3(0.8 + 0.2*uv.y);
  vec3 color = vec3(1.);


  // bubbles
	for(int i = 0; i < count; i++)
	{
    float fi = float(i);

		float phase =    sin(fi * 546.13 + 1. ) * .5 + .5;
		float size = pow(sin(fi * 651.74 + 5. ) * .5 + .5, 4.);
		float px =       sin(fi * 321.55 + 4.1) * resolution.x / resolution.y;

		float rad = .1 + .5*size;
		vec2 pos = vec2(px, -1. -rad + (2. + 2. * rad) * mod(phase + .1 * time * (.2 + .8 * size), 1.));
		float dis = length(uv - pos);

		// vec3 col = mix(vec3(.94, .3, 0.), vec3(.1, .4, .8), .5 + .5 * sin(fi * 1.2 + 1.9));
    vec3 col = mix(vec3(.5), vec3(.9), 0.5 + 0.5 * sin(fi * 1.2 + 1.9));

		// col+= 8.0*smoothstep( rad*0.95, rad, dis );

		float f = length(uv - pos) / rad;
		f = sqrt(clamp(1. - f * f, 0. ,1.));
		color -= col.zyx *(1. - smoothstep(rad * .95, rad, dis)) * f;

	}

	color *= sqrt(1.5 - .5 * length(uv));
	gl_FragColor = vec4(color, 1.0);

}
