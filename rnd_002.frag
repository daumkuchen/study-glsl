precision highp float;

uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D backbuffer;

float pi = 3.14159265;

// 3D perlin noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 p){
  vec3 pi0 = floor(p);
  vec3 pi1 = pi0 + vec3(1.0);
  pi0 = mod(pi0, 289.0);
  pi1 = mod(pi1, 289.0);
  vec3 pf0 = fract(p);
  vec3 pf1 = pf0 - vec3(1.0);
  vec4 ix = vec4(pi0.x, pi1.x, pi0.x, pi1.x);
  vec4 iy = vec4(pi0.yy, pi1.yy);
  vec4 iz0 = pi0.zzzz;
  vec4 iz1 = pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0 * (time * 0.2)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, pf0);
  float n100 = dot(g100, vec3(pf1.x, pf0.yz));
  float n010 = dot(g010, vec3(pf0.x, pf1.y, pf0.z));
  float n110 = dot(g110, vec3(pf1.xy, pf0.z));
  float n001 = dot(g001, vec3(pf0.xy, pf1.z));
  float n101 = dot(g101, vec3(pf1.x, pf0.y, pf1.z));
  float n011 = dot(g011, vec3(pf0.x, pf1.yz));
  float n111 = dot(g111, pf1);

  vec3 fade_xyz = fade(pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main(void) {
  vec2 position = (gl_FragCoord.xy / resolution.xy) + mouse * 0.1;
  gl_FragColor = vec4(vec3(cnoise(position.xyy * 32.0) * 10.0), 1.0);
}
