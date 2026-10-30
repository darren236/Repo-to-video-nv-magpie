import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {EASE, Grain, SpeedBlur, ramp, velocity} from './Polish';

// Adapted from Shotcraft's OutroGroupPhotoLaunch.tsx: 9 arrivals, overrun
// landing, speed blur, crane, recede, letterpress wordmark, rule, stage light.
// Every visual asset and metric here comes from nemotron-transcribe-demo.
const green = '#a8db3a';
const bg = '#0b0f0a';
const fly = Easing.bezier(0.34, 1.4, 0.44, 1);
const crane = Easing.bezier(0.3, 0, 0.2, 1);
const word = 'NEMOTRON';
type Element = {key: string; cx: number; cy: number; w: number; h: number; dx: number; dy: number; rot: number; cue: number; image?: string; top?: string; bottom?: string};
const elements: Element[] = [
  {key:'conversation',cx:295,cy:250,w:430,h:242,dx:-500,dy:-120,rot:-5,cue:4,image:'conversation.png'},
  {key:'jfk',cx:1615,cy:240,w:430,h:242,dx:500,dy:-150,rot:4,cue:7,image:'jfk.png'},
  {key:'artemis',cx:310,cy:800,w:430,h:242,dx:-450,dy:300,rot:3,cue:10,image:'artemis.png'},
  {key:'model',cx:1570,cy:735,w:435,h:116,dx:480,dy:250,rot:-3,cue:13,top:'MODEL',bottom:'Nemotron 3.5 Transcribe'},
  {key:'wav',cx:960,cy:84,w:330,h:96,dx:0,dy:-320,rot:2,cue:16,top:'SOURCE AUDIO',bottom:'mono · 16 kHz WAV'},
  {key:'json',cx:960,cy:835,w:460,h:108,dx:0,dy:320,rot:-2,cue:19,top:'SAVED RESULT',bottom:'JSON · word times · speakers'},
  {key:'hash',cx:1530,cy:880,w:390,h:100,dx:420,dy:260,rot:3,cue:22,top:'VERIFICATION',bottom:'SHA-256 audio binding'},
  {key:'srt',cx:630,cy:84,w:270,h:96,dx:-330,dy:-260,rot:-3,cue:25,top:'EXPORT',bottom:'SRT captions'},
  {key:'clips',cx:1290,cy:84,w:270,h:96,dx:420,dy:-250,rot:3,cue:28,top:'RENDER',bottom:'3 caption MP4s'},
];
const dust = Array.from({length:20},(_,i)=>({x:(i*439+137)%1920,y:(i*613+271)%1080,rise:.3+(i%5)*.11,size:2.4+(i%3)*.9,phase:(i*.83)%(Math.PI*2)}));

export const GroupPhoto: React.FC = () => {
  const f = useCurrentFrame();
  const clamped = Math.min(f, 180);
  const craneT = interpolate(clamped,[0,40],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:crane});
  const push = ramp(clamped,36,109,EASE.smooth);
  const recede = interpolate(clamped,[42,50],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const rule = ramp(clamped,58,12,EASE.swift);
  const ruleExt = ramp(clamped,58,8,EASE.swift) * (1-ramp(clamped,66,6,EASE.linear));
  const stageLight = ramp(clamped,42,8,EASE.out) * (1-0.5*ramp(clamped,50,8,EASE.out));
  const warning = ramp(f,210,18,EASE.out);
  const fade = 1-ramp(f,308,12,EASE.exit);
  return <AbsoluteFill style={{background:bg,color:'#f4f7ee',fontFamily:'Inter, Arial, sans-serif',overflow:'hidden',opacity:fade}}>
    <AbsoluteFill style={{transform:`perspective(1400px) rotateX(${4*(1-craneT)}deg) scale(${1.06-.06*craneT+.035*push})`,transformOrigin:'50% 45%'}}>
      <AbsoluteFill style={{opacity:.14,filter:'blur(14px)',transform:'scale(1.08)'}}><Img src={staticFile('shotcraft/conversation.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>
      <AbsoluteFill style={{background:'radial-gradient(900px 580px at 50% 48%, rgba(18,29,12,.65),rgba(5,9,4,.94))'}}/>
      {elements.map(el=>{
        if(f<el.cue)return null;
        const t=interpolate(clamped,[el.cue,el.cue+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:fly});
        const o=ramp(clamped,el.cue,3,EASE.linear)*(1-.12*recede);
        const pos=(fr:number)=>{const a=interpolate(fr,[el.cue,el.cue+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:fly});return [el.dx*(1-a),el.dy*(1-a)];};
        const vx=velocity(fr=>pos(fr)[0],clamped),vy=velocity(fr=>pos(fr)[1],clamped);
        const land=interpolate(clamped,[el.cue+9,el.cue+12,el.cue+16],[0,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        return <SpeedBlur key={el.key} vx={vx} vy={vy} amount={.3} max={22}>
          <div style={{position:'absolute',left:el.cx-el.w/2,top:el.cy-el.h/2,width:el.w,height:el.h,transform:`translate(${el.dx*(1-t)}px,${el.dy*(1-t)}px) rotate(${el.rot*(2-t)}deg) scale(${(1.12-.12*t)*(1-.015*land)})`,opacity:o,filter:`saturate(${1-.08*recede})`,borderRadius:13,overflow:'hidden',background:'#182316',border:'2px solid #496638',boxShadow:`0 ${10+26*(1-t)}px ${24+46*(1-t)}px #000b`}}>
            {el.image?<Img src={staticFile(`shotcraft/${el.image}`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{padding:'17px 24px'}}><div style={{color:green,fontSize:18,fontWeight:800,letterSpacing:2}}>{el.top}</div><div style={{fontSize:25,fontWeight:650,marginTop:10,whiteSpace:'nowrap'}}>{el.bottom}</div></div>}
          </div>
        </SpeedBlur>;
      })}
    </AbsoluteFill>
    {dust.map((d,i)=><div key={i} style={{position:'absolute',left:d.x+Math.sin(f*.03+d.phase)*14,top:((d.y-f*d.rise)%1080+1080)%1080,width:d.size,height:d.size,borderRadius:'50%',background:green,opacity:.2+.18*Math.sin(f*.2+d.phase),boxShadow:`0 0 ${d.size*4}px ${green}`}}/>)}
    <AbsoluteFill style={{background:`radial-gradient(650px 360px at 50% 48%,rgba(126,185,0,${.34*stageLight}),transparent 78%)`,pointerEvents:'none'}}/>
    <AbsoluteFill style={{display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
      <div style={{textAlign:'center',padding:'30px 50px',background:'radial-gradient(ellipse at center,#0b0f0ae8,#0b0f0a88 60%,transparent 75%)'}}>
        <div style={{display:'flex',justifyContent:'center',fontSize:121,fontWeight:870,letterSpacing:-4,lineHeight:1,textShadow:'0 14px 36px #000'}}>
          {word.split('').map((ch,i)=>{const t=interpolate(clamped,[42+i*1.8,50+i*1.8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.2,.75,.3,1)});return <span key={i} style={{display:'inline-block',opacity:t,transform:`translateY(${(1-t)*28}px) scale(${1.35-.35*t})`,filter:t<.995?`blur(${(1-t)*8}px)`:undefined}}>{ch}</span>;})}
        </div>
        <div style={{fontSize:46,fontWeight:750,letterSpacing:2,color:green,marginTop:7,opacity:ramp(clamped,66,12,EASE.out)}}>3.5 TRANSCRIBE</div>
        <div style={{position:'relative',width:330,height:5,margin:'28px auto 0',background:green,transform:`scaleX(${rule})`,boxShadow:`0 0 ${12*rule}px ${green}`}}>
          {ruleExt>0&&<><div style={{position:'absolute',right:'100%',top:2,width:190*ruleExt,height:1,background:green}}/><div style={{position:'absolute',left:'100%',top:2,width:190*ruleExt,height:1,background:green}}/></>}
        </div>
        <div style={{fontSize:28,letterSpacing:5,color:'#b9c6b1',marginTop:26,opacity:ramp(clamped,68,12,EASE.out)}}>TRACEABLE CAPTIONS FROM REAL RUNS</div>
      </div>
    </AbsoluteFill>
    <div style={{position:'absolute',left:275,right:275,bottom:48,padding:'17px 28px',border:`1px solid #6b8f47`,background:'#172416ef',borderRadius:12,textAlign:'center',fontSize:25,fontWeight:650,opacity:warning,transform:`translateY(${(1-warning)*15}px)`}}>Unedited model output · review the Artemis radio transcript against its recording</div>
    <Grain opacity={.04}/>
  </AbsoluteFill>;
};
