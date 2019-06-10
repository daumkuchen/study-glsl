#iChannel0 file://./_image/cat_01.jpg

float random(vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void mainImage(out vec4 fragColor, in vec2 p) {

	float r = random(gl_FragCoord.xy * iTime);

	// sand storm
	// p.x = p.x + abs(r);

	vec2 pos = p;
	// if(pos.x > .5){
	// 	pos.x = pos.y + abs(iTime * .05);
	// }
	
	pos.x = pos.y + abs(iTime * .05);

	// if(p.y > r){
	// 	p.y = p.x + abs(r);
	// }

    vec4 tex = texture2D(iChannel0, p);
	vec4 tex_conv = texture2D(iChannel0, pos);

	tex = tex - tex_conv;

	vec3 col = tex.rgb;
	// vec3 col = vec3((tex.r + tex.b + tex.g) / 3.);

    fragColor = vec4(col, 1.);
    
}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 p = gl_FragCoord.xy / iResolution.xy;

    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}