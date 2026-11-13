/* Concept illustration of on-device autonomy and an encrypted boundary.
   This visual makes no claim about implemented cryptography or physical safety. */
(() => {
  'use strict';
  if (!window.SFRMotion) return;
  window.SFRMotion.register({
    slideId:'slide-12',
    host:'.security-visual',
    label:'Concept: on-device intelligence continues inside an encrypted boundary after an external network link disconnects.',
    build(T,width,height) {
      const scene=new T.Scene();
      const camera=new T.OrthographicCamera(-3.02*width/height,3.02*width/height,3.02,-3.02,.1,50);
      camera.position.set(5.4,4.2,8.8);camera.lookAt(0,.12,0);
      scene.add(new T.HemisphereLight(0xbfd3ff,0x081020,2.3));
      for(const [color,intensity,position] of [[0xecf3ff,5.2,[-3,6,5]],[0x6a8fff,4.1,[5,2,-4]],[0xb7cff7,2.1,[-4,0,-3]]]){
        const light=new T.DirectionalLight(color,intensity);light.position.set(...position);scene.add(light);
      }
      const resources=[];
      const own=x=>{resources.push(x);return x;};
      const material=values=>own(new T.MeshPhysicalMaterial(values));
      const mesh=(geometry,mat,parent=scene)=>{const object=new T.Mesh(own(geometry),mat);parent.add(object);return object;};
      const dark=material({color:0x111b30,metalness:.62,roughness:.29,clearcoat:.8});
      const titanium=material({color:0x40567c,metalness:.75,roughness:.25,clearcoat:1});
      const silver=material({color:0xb8c9df,metalness:.67,roughness:.25});
      const sapphire=material({color:0x344b9f,metalness:.53,roughness:.22,emissive:0x2d4eaa,emissiveIntensity:.35,clearcoat:1});
      const core=new T.Group();scene.add(core);
      const box=(w,h,d,y,mat)=>{const o=mesh(new T.BoxGeometry(w,h,d),mat,core);o.position.y=y;return o;};
      box(2.05,.12,2.05,-.36,dark);
      box(1.97,.1,1.97,-.24,titanium);
      box(1.75,.055,1.75,-.155,silver);
      box(1.64,.1,1.64,-.08,dark);
      box(1.49,.06,1.49,.015,sapphire);
      const pinGeometry=own(new T.BoxGeometry(.066,.045,.25));
      for(let side=0;side<4;side++){
        const pins=new T.Group();pins.rotation.y=side*Math.PI/2;core.add(pins);
        for(let i=0;i<11;i++){
          const p=new T.Mesh(pinGeometry,silver);p.position.set((i-5)*.16,-.27,1.04);pins.add(p);
        }
      }
      const edgeMat=own(new T.LineBasicMaterial({color:0xb2c8ff,transparent:true,opacity:.7}));
      const outline=[[-.755,.052,-.755],[.755,.052,-.755],[.755,.052,.755],[-.755,.052,.755],[-.755,.052,-.755]].map(p=>new T.Vector3(...p));
      core.add(new T.Line(own(new T.BufferGeometry().setFromPoints(outline)),edgeMat));
      // Nine active cells continue after the external route disappears.
      const cells=[];const cellGeometry=own(new T.BoxGeometry(.36,.04,.36));
      for(let row=0;row<3;row++)for(let col=0;col<3;col++){
        const m=material({color:0x5578cd,metalness:.5,roughness:.25,emissive:0x416ce8,emissiveIntensity:.4});
        const cell=new T.Mesh(cellGeometry,m);cell.position.set((col-1)*.435,.07,(row-1)*.435);core.add(cell);cells.push({cell,row,col});
      }
      const shieldMaterial=own(new T.ShaderMaterial({
        uniforms:{tint:{value:new T.Color(0x6e96ff)},strength:{value:1}},
        vertexShader:'varying vec3 vNormal; varying vec3 vView; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=-p.xyz;gl_Position=projectionMatrix*p;}',
        fragmentShader:'uniform vec3 tint; uniform float strength; varying vec3 vNormal; varying vec3 vView; void main(){float rim=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),3.2);gl_FragColor=vec4(tint,(0.012+rim*0.23)*strength);}',
        transparent:true,depthWrite:false,side:T.FrontSide,blending:T.AdditiveBlending
      }));
      const shield=mesh(new T.SphereGeometry(2.03,64,40),shieldMaterial);
      shield.renderOrder=4;
      const ringGeometry=own(new T.TorusGeometry(2.075,.009,7,180));
      const ringMaterial=own(new T.MeshBasicMaterial({color:0x84a5ff,transparent:true,opacity:.72}));
      const orbit=new T.Group();orbit.rotation.set(1.1,.2,-.4);scene.add(orbit);
      orbit.add(new T.Mesh(ringGeometry,ringMaterial));
      const meridian=new T.Group();meridian.rotation.set(.2,.1,.6);scene.add(meridian);
      mesh(new T.TorusGeometry(2.045,.004,5,160),own(new T.MeshBasicMaterial({color:0x6988ce,transparent:true,opacity:.34})),meridian);
      const secondMeridian=mesh(new T.TorusGeometry(2.04,.0035,5,160),own(new T.MeshBasicMaterial({color:0x7496dc,transparent:true,opacity:.17})));
      secondMeridian.rotation.set(.12,1.13,-.26);
      const cometGeometry=own(new T.BufferGeometry());
      const tailLength=54,tailPositions=new Float32Array(tailLength*3),tailColors=new Float32Array(tailLength*3);
      for(let i=0;i<tailLength;i++){
        const a=-.85+i/(tailLength-1)*.85;tailPositions.set([Math.cos(a)*2.075,Math.sin(a)*2.075,0],i*3);
        const bright=Math.pow(i/(tailLength-1),1.5);tailColors.set([.12+.6*bright,.2+.65*bright,.5+.5*bright],i*3);
      }
      cometGeometry.setAttribute('position',new T.BufferAttribute(tailPositions,3));
      cometGeometry.setAttribute('color',new T.BufferAttribute(tailColors,3));
      const comet=new T.Group();orbit.add(comet);
      comet.add(new T.Line(cometGeometry,own(new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.97}))));
      const head=mesh(new T.OctahedronGeometry(.065,0),own(new T.MeshBasicMaterial({color:0xdce7ff})),comet);head.position.x=2.075;head.scale.set(.8,1.7,.55);
      const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
      const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,1,64,64,62);
      gradient.addColorStop(0,'rgba(161,193,255,.9)');gradient.addColorStop(.17,'rgba(105,149,255,.46)');gradient.addColorStop(.5,'rgba(79,121,246,.12)');gradient.addColorStop(1,'rgba(35,70,180,0)');
      gc.fillStyle=gradient;gc.fillRect(0,0,128,128);
      const glowTexture=own(new T.CanvasTexture(glowCanvas));
      const halo=new T.Sprite(own(new T.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.7})));halo.scale.set(.44,.44,1);halo.position.copy(head.position);comet.add(halo);
      // Ciphertext glyphs are illustrative packets, not a cryptographic output.
      const glyphTexture=value=>{
        const c=document.createElement('canvas');c.width=128;c.height=64;const ctx=c.getContext('2d');
        ctx.fillStyle='#d9e5ff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 30px monospace';ctx.fillText(value,64,34);
        const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;return texture;
      };
      const packetGroups=[];
      ['7F','A2','09','E4','C8','3D','B1','6A'].forEach((value,index)=>{
        const sprite=new T.Sprite(own(new T.SpriteMaterial({map:glyphTexture(value),color:0xc6d5ff,transparent:true,opacity:.67,depthWrite:false})));
        sprite.scale.set(.38,.19,1);scene.add(sprite);packetGroups.push({sprite,index});
      });
      // A small dimensional lock closes, without dominating the processor.
      const lock=new T.Group();lock.quaternion.copy(camera.quaternion);lock.position.set(0,1.03,.14);scene.add(lock);
      const lockMat=material({color:0x8caeff,metalness:.5,roughness:.23,emissive:0x223e89,emissiveIntensity:.32});
      const body=mesh(new T.BoxGeometry(.38,.29,.105),lockMat,lock);body.position.y=-.04;
      const shackle=mesh(new T.TorusGeometry(.125,.024,8,30,Math.PI),silver,lock);shackle.position.y=.115;
      const shackleEnds=[-.125,.125].map(x=>{const end=mesh(new T.CylinderGeometry(.024,.024,.105,8),silver,lock);end.position.set(x,.065,0);return end;});
      const keyMat=own(new T.MeshBasicMaterial({color:0x112447}));
      const key=mesh(new T.CircleGeometry(.032,18),keyMat,lock);key.position.set(0,-.03,.054);
      const keyStem=mesh(new T.PlaneGeometry(.025,.065),keyMat,lock);keyStem.position.set(0,-.07,.055);
      // The route withdraws into the external node once, then remains disconnected.
      const network=new T.Group();network.quaternion.copy(camera.quaternion);network.position.set(-2.7,.05,.4);scene.add(network);
      const networkMat=own(new T.MeshBasicMaterial({color:0x66799b,transparent:true,opacity:.55}));
      const node=mesh(new T.OctahedronGeometry(.15,0),networkMat,network);
      const routePoints=[new T.Vector3(0,0,0),new T.Vector3(.95,0,0)];
      const routeGeometry=own(new T.BufferGeometry().setFromPoints(routePoints));
      const routeMaterial=own(new T.LineDashedMaterial({color:0x6079b8,transparent:true,opacity:.5,dashSize:.07,gapSize:.05}));
      const route=new T.Line(routeGeometry,routeMaterial);route.computeLineDistances();network.add(route);
      const crossMaterial=own(new T.LineBasicMaterial({color:0x99acd1,transparent:true,opacity:0}));
      const cross=new T.LineSegments(own(new T.BufferGeometry().setFromPoints([new T.Vector3(-.1,-.1,.18),new T.Vector3(.1,.1,.18),new T.Vector3(-.1,.1,.18),new T.Vector3(.1,-.1,.18)])),crossMaterial);network.add(cross);
      const coreLight=new T.PointLight(0x537dff,4.8,5,2);coreLight.position.set(0,.6,0);scene.add(coreLight);
      return {
        scene,camera,
        update(t) {
          const clamp=x=>Math.max(0,Math.min(1,x));
          const closed=clamp((t-.55)/1.1);
          core.rotation.y=-.12+Math.sin(t*.22)*.075;
          core.position.y=Math.sin(t*.74)*.035;
          for(const {cell,row,col} of cells)cell.material.emissiveIntensity=.3+.65*Math.pow(Math.max(0,Math.sin(t*1.45-row*.6-col*.3)),3);
          shieldMaterial.uniforms.strength.value=.88+Math.sin(t*.65)*.1;
          orbit.rotation.y=.2+Math.sin(t*.16)*.17;
          meridian.rotation.y=t*.08;
          comet.rotation.z=t*.39+.85;
          head.rotation.z=t*.6;
          packetGroups.forEach(({sprite,index})=>{
            const angle=t*.16+index*Math.PI*2/packetGroups.length;
            const point=new T.Vector3(Math.cos(angle)*1.95,Math.sin(angle)*1.95,0).applyAxisAngle(new T.Vector3(1,0,0),1.05).applyAxisAngle(new T.Vector3(0,0,1),-.4);
            sprite.position.copy(point);sprite.material.opacity=.35+.3*(.5+.5*Math.sin(angle));
          });
          lock.position.y=1.03+Math.sin(t*.74)*.035;
          shackle.position.y=.115+(1-closed)*.16;
          shackleEnds.forEach(end=>end.position.y=.065+(1-closed)*.16);
          lock.scale.setScalar(.88+.12*closed);
          route.scale.x=1-closed*.96;routeMaterial.opacity=.5*(1-closed);
          networkMat.opacity=.5-closed*.26;crossMaterial.opacity=closed*.56;
          node.rotation.y=t*.15;coreLight.intensity=4.7+Math.sin(t*1.3)*.5;
        },
        dispose(){resources.forEach(resource=>resource.dispose?.());}
      };
    }
  });
})();
