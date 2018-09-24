#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

vec3 diskWithMotionBlur( vec3 col, in vec2 uv, in vec3 sph, in vec2 cd, in vec3 sphcol )
{
	vec2 xc = uv - sph.xy;
	float a = dot(cd,cd);
	float b = dot(cd,xc);
	float c = dot(xc,xc) - sph.z*sph.z;
	float h = b*b - a*c;
	if( h>0.0 ) {
		h = sqrt( h );

		float ta = max( 0.0, (-b - h)/a );
		float tb = min( 1.0, (-b + h)/a );

		// we can comment this conditional, in fact
		if( ta < tb ) col = mix( col, sphcol, clamp(2.0*(tb-ta),0.0,1.0) );
	}
	return col;
}

vec3 hash3( float n ) { return fract(sin(vec3(n,n+1.0,n+2.0))*43758.5453123); }
vec4 hash4( float n ) { return fract(sin(vec4(n,n+1.0,n+2.0,n+3.0))*43758.5453123); }

const float speed = 8.0;

vec2 getPosition(float time, vec4 id) {
	return vec2(0.9*sin((speed*(0.75+0.5*id.z))*time+20.0*id.x), 0.75*cos(speed*(0.75+0.5*id.w)*time+20.0*id.y));
}

vec2 getVelocity( float time, vec4 id ) {
	return vec2(speed*0.9*cos((speed*(0.75+0.5*id.z))*time+20.0*id.x), -speed*0.75*sin(speed*(0.75+0.5*id.w)*time+20.0*id.y));
}

void main()
{

	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy) / resolution.y;

	vec3 col = vec3(0.2) + 0.05*p.y;

	float t = time * .5;

	for( int i=0; i<16; i++ )
	{
		vec4 off = hash4(float(i)* 13.13);
    vec3 sph = vec3( getPosition(t, off), 0.02+0.1*off.x);
    vec2 cd = getVelocity(t, off) / 24.0;
		vec3 sphcol = 0.7 + 0.3*sin(3.0*off.z + vec3(4.0,0.0,2.0));
    col = diskWithMotionBlur(col, p, sph, cd, sphcol);
	}

  col += (1.0/255.0)*hash3(p.x+13.0*p.y);

	gl_FragColor = vec4(col, 1.0);

}
