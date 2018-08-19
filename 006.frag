#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec3 hsv(float h, float s, float v){
	vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
	return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void){

	vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	int j = 0;
	vec2 x = vec2(-0.345, 0.654);
	vec2 y = vec2(time * 0.005, 0.0);
	vec2 z = p;
	for(int i = 0; i < 360; i++){
		j++;
		if(length(z) > 2.0){
      break;
    }
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x + y;
	}

	float h = abs(mod(time * 15.0 - float(j), 360.0) / 360.0);;
	vec3 rgb = hsv(h, 1.0, 1.0);
	gl_FragColor = vec4(rgb, 1.0);

}
