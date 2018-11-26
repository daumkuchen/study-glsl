#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
uniform sampler2D japan1;
uniform sampler2D japan2;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main()
{

	// float t = exp(-1. * fract(time));
	// float t = exp(-1. * cos(time));
	// float t = mod(cos(time), 1.);
	float t = cos(time * 2.);
	float dispFactor = smoothstep(0., 1., t);
	float effectFactor = 1.;

  vec2 imageResolution = vec2(640, 360);

	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 tUv = gl_FragCoord.xy / resolution;

  // vec2 ratio = vec2(
  //   	min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.),
  //   	min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.)
  // );
  //
	// tUv = vec2(
  //   	tUv.x * ratio.x + (1. - ratio.x) * .5,
  //   	tUv.y * ratio.y + (1. - ratio.y) * .5
  // );

	vec2 pos1 = vec2(
		tUv.x - dispFactor * (snoise(tUv * 2.) * effectFactor),
		tUv.y - dispFactor * (snoise(tUv * 2.) * effectFactor)
	);

	vec2 pos2 = vec2(
		tUv.x + (1. - dispFactor) * (snoise(tUv * 2.) * effectFactor),
		tUv.y + (1. - dispFactor) * (snoise(tUv * 2.) * effectFactor)
	);

	vec4 _texture1 = texture2D(japan1, pos1);
	vec4 _texture2 = texture2D(japan2, pos2);

	vec4 destTexture = mix(_texture1, _texture2, dispFactor);

	gl_FragColor = destTexture;

}
