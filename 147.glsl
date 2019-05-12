#define FAR 40.

// https://qiita.com/edo_m18/items/1532aceb9d470174caaf

float hash( float n ){ return fract(cos(n)*45758.5453); }

vec3 tex3D( sampler2D tex, in vec3 p, in vec3 n ){
   
    n = max(n*n, 0.001);
    // n = max((abs(n) - 0.2)*7., 0.001); // n = max(abs(n), 0.001), etc.
    n /= (n.x + n.y + n.z ); 
	return (texture(tex, p.yz)*n.x + texture(tex, p.zx)*n.y + texture(tex, p.xy)*n.z).xyz;
 
}

float sminP( float a, float b, float smoothing ){

    float h = clamp( 0.5+0.5*(b-a)/smoothing, 0.0, 1.0 );
    return mix( b, a, h ) - smoothing*h*(1.0-h);

}

// float map(vec3 q){
    
//     vec3 p;
// 	// Scale factor, and distance.
//     float s = 3., d = 0.;
    
//     for(int i=0; i<3; i++){
//  		// Repeat space.
//         p = abs(fract(q/s)*s - s/2.); // Equivalent to: p = abs(mod(q, s) - s/2.);
// 		// Repeat Void Cubes. Cubes with a cross taken out.
//  		d = max(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - s/3.);
//     	s /= 3.; // Divide space (each dimension) by 3.
//     }
 
//  	return d;

// }

float map(vec3 q){
    
    // Layer one. The ".05" on the end varies the hole size.
 	vec3 p = abs(fract(q/3.)*3. - 1.5);
 	float d = min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - 1. + .05;
    
    // Layer two.
    p =  abs(fract(q) - .5);
 	d = max(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - 1./3. + .05);
   
    // Layer three. 3D space is divided by two, instead of three, to give some variance.
    p =  abs(fract(q*2.)*.5 - .25);
 	d = max(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - .5/3. - .015); 

    // Layer four. The little holes, for fine detailing.
    p =  abs(fract(q*3./.5)*.5/3. - .5/6.);
 	return max(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - 1./18. - .015);
    //return max(d, max(max(p.x, p.y), p.z) - 1./18. - .024);
    //return max(d, length(p) - 1./18. - .048);
    
    //p =  abs(fract(q*3.)/3. - .5/3.);
 	//return max(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - 1./9. - .04);

}

float trace(vec3 ro, vec3 rd){
    
    float t = 0., d;
    for(int i=0; i< 64; i++){
        d = map(ro + rd*t);
        if (d <.0025*t || t>FAR) break;
        t += d;
    } 
    return t;

}

float refTrace(vec3 ro, vec3 rd){

    float t = 0., d;
    for(int i=0; i< 16; i++){
        d = map(ro + rd*t);
        if (d <.0025*t || t>FAR) break;
        t += d;
    } 
    return t;

}

vec3 normal(in vec3 p){

    // Note the slightly increased sampling distance, to alleviate artifacts due to hit point inaccuracies.
    vec2 e = vec2(0.005, -0.005); 
    return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));

}

/*
// Standard normal function.
vec3 normal(in vec3 p) {
	const vec2 e = vec2(0.005, 0);
	return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy),	map(p + e.yyx) - map(p - e.yyx)));
}
*/

// Ambient occlusion, for that self shadowed look.
// XT95 came up with this particular version. Very nice.
//
// Hemispherical SDF AO - https://www.shadertoy.com/view/4sdGWN
// Alien Cocoons - https://www.shadertoy.com/view/MsdGz2
float calculateAO(in vec3 p, in vec3 n){
    
	float ao = 0.0, l;
	const float nbIte = 6.0;
	const float falloff = 1.;
    
    const float maxDist = 1.;
    for(float i=1.; i<nbIte+.5; i++){
    
        l = (i + hash(i))*.5/nbIte*maxDist;
        ao += (l - map( p + n*l ))/ pow(1. + l, falloff);
    }
	
    return clamp( 1.-ao/nbIte, 0., 1.);

}


// Cheap shadows are hard. In fact, I'd almost say, shadowing repeat objects - in a setting like this - with limited 
// iterations is impossible... However, I'd be very grateful if someone could prove me wrong. :)
float softShadow(vec3 ro, vec3 lp, float k){

    // More would be nicer. More is always nicer, but not really affordable... Not on my slow test machine, anyway.
    const int maxIterationsShad = 16; 
    
    vec3 rd = (lp-ro); // Unnormalized direction ray.

    float shade = 1.0;
    float dist = 0.05;    
    float end = max(length(rd), 0.001);
    float stepDist = end/float(maxIterationsShad);
    
    rd /= end;

    // Max shadow iterations - More iterations make nicer shadows, but slow things down. Obviously, the lowest 
    // number to give a decent shadow is the best one to choose. 
    for (int i=0; i<maxIterationsShad; i++){

        float h = map(ro + rd*dist);
        //shade = min(shade, k*h/dist);
        shade = min(shade, smoothstep(0.0, 1.0, k*h/dist)); // Subtle difference. Thanks to IQ for this tidbit.
        //dist += min( h, stepDist ); // So many options here: dist += clamp( h, 0.0005, 0.2 ), etc.
        dist += clamp(h, 0.02, 0.25);
        
        // Early exits from accumulative distance function calls tend to be a good thing.
        if (h<0.001 || dist > end) break; 
    }

    // I've added 0.5 to the final shade value, which lightens the shadow a bit. It's a preference thing.
    return min(max(shade, 0.) + 0.5, 1.0);

}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    
    // Unit direction ray vector: Note the absence of a divide term. I came across this via a comment 
    // Shadertoy user "Coyote" made. I'm pretty happy with this.
    vec3 rd = (vec3(2.*fragCoord - iResolution.xy, iResolution.y)); // Normalizing below.
    
    // Barrel distortion. Looks interesting, but I like it because it fits more of the scene in.
    // If you comment this out, make sure you normalize the line above.
    rd = normalize(vec3(rd.xy, sqrt(max(rd.z*rd.z - dot(rd.xy, rd.xy)*.2, 0.))));
    
    // Rotating the ray with Fabrice's cost cuttting matrix. I'm still pretty happy with this also. :)
    vec2 m = sin(vec2(0, 1.57079632) + iTime/4.);
    rd.xy = mat2(m.y, -m.x, m)*rd.xy;
    rd.xz = mat2(m.y, -m.x, m)*rd.xz;
    
    
    // Ray origin, set off in the Z direction.
    vec3 ro = vec3(0.0, 0.0, iTime);
    vec3 lp = ro  + vec3(0.0, 1.0, 0.0); // Light, near the ray origin.
    
    // Initiate the scene color to black.
    vec3 col = vec3(0);
    
    float t = trace(ro, rd); // Raymarch.
    
    // Scene hit, so do some lighting.
    if(t<FAR){
    
        vec3 sp = ro + rd*t; // Surface position.
        vec3 sn = normal(sp); // Surface normal.
        vec3 ref = reflect(rd, sn); // Reflected ray.

		const float ts = 2.; // Texture scale.
        vec3 oCol = tex3D(iChannel0, sp*ts, sn); // Texture color at the surface point.
        
        // Darker toned wood paneling. Very fancy. :)
        vec3 q = abs(mod(sp, 3.) - 1.5);
        if (max(max(q.x, q.y), q.z) < 1.063) oCol = oCol*vec3(.7, .85, 1.); 

        // Bringing out the texture colors a bit.
        oCol = smoothstep(0.0, 1.0, oCol);
 
        float sh = softShadow(sp, lp, 16.); // Soft shadows.
        float ao = calculateAO(sp, sn); // Self shadows.

        vec3 ld = lp - sp; // Light direction.
        float lDist = max(length(ld), 0.001); // Light to surface distance.
        ld /= lDist; // Normalizing the light direction vector.

        float diff = max(dot(ld, sn), 0.); // Diffuse component.
        float spec = pow(max(dot(reflect(-ld, sn), -rd), 0.), 12.); // Specular.
        //float fres = clamp(1.0 + dot(rd, sn), 0.0, 1.0); // Fresnel reflection term.

        float atten = 1.0 / (1.0 + lDist*0.25 + lDist*lDist*.1); // Attenuation.
        
        // Secondary camera light, just to light up the dark areas a bit more. It's here just
        // to add a bit of ambience, and its effects are subtle, so its attenuation 
        // will be rolled into the attenuation above.
        diff += max(dot(-rd, sn), 0.)*.45;
        spec += pow(max(dot(reflect(rd, sn), -rd), 0.), 12.)*.45;
        
        // Based on Eiffie's suggestion. It's an improvement, but I've commented out, 
        // for the time being.
        //spec *= curve(sp); 

		// REFLECTION BLOCK.
        //
        // Cheap reflection: Not entirely accurate, but the reflections are pretty subtle, so not much 
        // effort is being put in.
        float rt = refTrace(sp + ref*0.1, ref); // Raymarch from "sp" in the reflected direction.
        vec3 rsp = sp + ref*rt; // Reflected surface hit point.
        vec3 rsn = normal(rsp); // Normal at the reflected surface.
        
        vec3 rCol = tex3D(iChannel0, rsp*ts, rsn); // Texel at "rsp."
        q = abs(mod(rsp, 3.) - 1.5);
        if (max(max(q.x, q.y), q.z)<1.063) rCol = rCol*vec3(.7, .85, 1.);  
        // Toning down the power of the reflected color, simply because I liked the way it looked more. 
        rCol = sqrt(rCol); 
        float rDiff = max(dot(rsn, normalize(lp-rsp)), 0.); // Diffuse at "rsp" from the main light.
        rDiff += max(dot(rsn, normalize(-rd-rsp)), 0.)*.45; // Diffuse at "rsp" from the camera light.
        
        float rlDist = length(lp - rsp);
        float rAtten = 1./(1.0 + rlDist*0.25 + rlDist*rlDist*.1);
        rCol = min(rCol, 1.)*(rDiff + vec3(.5, .6, .7))*rAtten; // Reflected color. Not accurate, but close enough.
        //
    	// END REFLECTION BLOCK.
        

        // Combining the elements above to light and color the scene.
        col = oCol*(diff + vec3(.5, .6, .7)) + vec3(.5, .7, 1)*spec*2. + rCol*0.25;


        // Shading the scene color, clamping, and we're done.
        col = min(col*atten*sh*ao, 1.);
        
    }
    
    // Working in a bit of a blue fadeout in the distance. Totally fake. I chose blue to counter all
    // that walnut. Seemed like a good idea at the time. :)
    col = mix(col, vec3(.55, .75, 1.), smoothstep(0., FAR - 15., t));////1.-exp(-0.01*t*t)

    // No gamma correction: It was a style choice, plus I didn't feel like going back and retweaking the 
    // colors, shades, etc. Just pretend it's a gamma corrected postprocessed value. :)
	fragColor = vec4(col, 1.0);
    
}