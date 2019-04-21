#define LINEAR_DENSITY 1  // 0: constant
#define DENS 2.           // tau.rho
#define rad .3            // sphere radius
#define H   .05           // skin layer thickness (for linear density)
#define ANIM true         // true/false
#define PI 3.14159

vec4 skyColor =     vec4(.7,.8,1.,1.);
vec3 sunColor = 10.*vec3(1.,.7,.1);   // NB: is Energy 

vec2 FragCoord;

// --- noise functions from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

mat3 m = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0 + 113.0*p.z;

    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p )
{
    float f;
    f  = 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f;
}
// --- End of: Created by inigo quilez --------------------

vec3 noise3( vec3 p )
{
	if (ANIM) p += iTime;
    float fx = noise(p);
    float fy = noise(p+vec3(1345.67,0,45.67));
    float fz = noise(p+vec3(0,4567.8,-123.4));
    return vec3(fx,fy,fz);
}
vec3 fbm3( vec3 p )
{
	if (ANIM) p += iTime;
    float fx = fbm(p);
    float fy = fbm(p+vec3(1345.67,0,45.67));
    float fz = fbm(p+vec3(0,4567.8,-123.4));
return vec3(fx,fy,fz);
}
vec3 perturb3(vec3 p, float scaleX, float scaleI)
{
    scaleX *= 2.;
	return scaleI*scaleX*fbm3(p/scaleX); // usually, to be added to p
}

float constantDensityTransmittance(float NDotL,float NDotO)
{
    return NDotL/(DENS*(NDotL+NDotO));
}

float linearDensityTransmittance(float NDotL,float NDotO,float LDotO)
{
    if (FragCoord.y/iResolution.y>.42)
		return sqrt(PI/2.) / sqrt(DENS/H* NDotO/NDotL*(NDotL+NDotO) ) ; // test1
	else
     // return .15*DENS*NDotL/(NDotL+NDotO)*sqrt(1.-LDotO*LDotO);       // test2
		return .15*DENS*NDotL/(NDotL+NDotO);                            // test3
}

float Rz=0.;  // 1/2 ray length inside object
vec4 intersectSphere(vec3 rpos, vec3 rdir)
{
    vec3 op = vec3(0.0, 0.0, 0.0) - rpos;
    //float rad = 0.3;
  
    float eps = 1e-5;
    float b = dot(op, rdir);
    float det = b*b - dot(op, op) + rad*rad;
      
    if (det > 0.0)
    {
        det = sqrt(det);
        float t = b - det;
        if (t > eps)
        {
            vec4 P = vec4(normalize(rpos+rdir*t), t);
            Rz = rad*P.z;   // 1/2 ray length inside object
#if LINEAR_DENSITY    
            // skin layer counts less
            float dH = 1.+H*(H-2.*rad)/(Rz*Rz);
            if (dH>0.) // core region
                Rz *= .5*(1.+sqrt(dH));
            else
                Rz *= .5*rad*(1.-sqrt(1.-Rz*Rz/(rad*rad)))/H;
#endif
            return P;
        }
    }
  
    return vec4(0.0);
}

bool computeNormal(in vec3 cameraPos, in vec3 cameraDir, out vec3 normal)
{
    cameraPos = cameraPos+perturb3(cameraDir,.06,1.5);
    vec4 intersect = intersectSphere(cameraPos,cameraDir);
    if ( intersect.w > 0.)
    {
        normal = intersect.xyz;
        //normal = normalize(normal+perturb3(normal,.3,30.));
        return true;
    }
    return false;
}
float computeTransmittance( in vec3 cameraPos, in vec3 cameraDir, in vec3 lightDir )
{
    vec3 normal;
    if ( computeNormal(cameraPos,cameraDir,normal))
    {
        float NDotL = clamp(dot(normal,lightDir),0.,1.);
        float NDotO = clamp(dot(normal,cameraPos),0.,1.);
        float LDotO = clamp(dot(lightDir,cameraPos),0.,1.);
      
#if LINEAR_DENSITY
        float transmittance = linearDensityTransmittance(NDotL,NDotO,LDotO)*.5;
#else
        float transmittance = constantDensityTransmittance(NDotL,NDotO);
#endif
        return transmittance;
    }

    return -1.;
}

void mainImage(out vec4 fragColor, in vec2 p) {

    // FragCoord = fragCoord;
    
    //camera
    vec3 cameraPos = vec3(0.0, 0.0, 1.0);
    vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
    vec3 ww = normalize( cameraPos - cameraTarget );
    vec3 uu = normalize(cross( vec3(0.0, 1.0, 0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));

    // vec2 q = p / iResolution.xy;
    vec2 q = p;

    // vec2 p = -1.0 + 2.0*q;
    // p.x *= iResolution.x/ iResolution.y;

    vec3 cameraDir = normalize( p.x*uu + p.y*vv - 1.5*ww );
 
    //light
    float theta = (iMouse.x / iResolution.x *2. - 1.)*PI;
    float phi = (iMouse.y / iResolution.y - .5)*PI;
    vec3 lightDir =vec3(sin(theta)*cos(phi),sin(phi),cos(theta)*cos(phi));
  
	// shade object
    float transmittance = computeTransmittance( cameraPos, cameraDir, lightDir );
	
	// display: special cases
	if (abs(q.y-.42)*iResolution.y<.5)  fragColor = vec4(.75);
    else if (transmittance<0.) 		    fragColor = skyColor;
	else if (transmittance>1.) 		    fragColor = vec4(1.,0.,0.,1.); 		
	else
	{
        // display: object
		Rz = 1.-exp(-8.*DENS*Rz);
	    float alpha = Rz;
    	// fragColor = vec4(alpha); return;
    	vec3 frag = vec3(transmittance,transmittance,transmittance);
   		fragColor = vec4(frag*sunColor,alpha) + (1.-alpha)*skyColor;
	}
	
    // display: light
    // float d = length(vec2(lightDir)-p)*iResolution.x;
    // float Z; if (lightDir.z>0.) Z=1.; else Z=0.;
    // if (d<10.) fragColor = vec4(1.,Z,.5,1.);
  
    // vec3 normal;
    // computeNormal(cameraPos,cameraDir, normal);
    // fragColor = vec4(normal,1.);
    
}

void main() {

    vec2 p = (gl_FragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec4 col;
    mainImage(col, p);
    gl_FragColor = col;

}