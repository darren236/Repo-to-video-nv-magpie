import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EASE, ramp} from './shotcraft/Polish';
import {SpotlightSource} from './shotcraft/SpotlightSource';
import {Terminal3D} from './shotcraft/Terminal3D';
import {VoiceWaveformLive} from './shotcraft/VoiceWaveformLive';
import {GroupPhoto} from './shotcraft/GroupPhoto';
import result from './shotcraft/source-result-excerpt.json';
import pilot from './shotcraft/pilot-scenes.json';

const green = '#a8db3a';
const bg = '#0b0f0a';

const SourceTag: React.FC<{label: string}> = ({label}) => <div style={{position:'absolute',left:85,bottom:55,font:'20px ui-monospace, monospace',color:'#a9baa0',background:'#0b0f0acc',padding:'8px 13px',borderRadius:5}}>{label}</div>;

const MethodsFigure: React.FC<{f: number}> = ({f}) => {
  const enter = ramp(f, 0, 18, EASE.out);
  return <AbsoluteFill style={{background:bg,color:'#eff4eb',fontFamily:'Inter, Arial, sans-serif'}}>
    <div style={{position:'absolute',left:97,top:42,color:green,fontSize:24,fontWeight:800,letterSpacing:4}}>FROM THE CURRENT REPOSITORY</div>
    <div style={{position:'absolute',left:97,top:85,fontSize:48,fontWeight:800,letterSpacing:-1.5}}>From WAV to captioned MP4.</div>
    <div style={{position:'absolute',left:220,top:178,width:1480,height:802,background:'#fff',boxShadow:'0 30px 75px #000b',border:'2px solid #6b8f47',opacity:enter,transform:`translateY(${(1-enter)*38}px) scale(${0.96+0.04*enter})`}}>
      <Img src={staticFile('shotcraft/video-workflow.svg')} style={{width:'100%',height:'100%'}}/>
    </div>
    <SourceTag label="SOURCE · README.md · site/video-workflow.svg · commit 17499c0"/>
  </AbsoluteFill>;
};

const TerminalScene: React.FC = () => {
  const f = useCurrentFrame();
  return f >= 250 ? <MethodsFigure f={f-250}/> : <AbsoluteFill>
    <Terminal3D/>
    <div style={{position:'absolute',top:54,left:85,color:green,font:'800 25px Inter, Arial, sans-serif',letterSpacing:4,background:'#091007cc',padding:'12px 20px'}}>THE REPOSITORY WORKFLOW</div>
    <div style={{position:'absolute',top:54,right:85,color:'#d7e5ce',font:'600 21px Inter, Arial, sans-serif',background:'#091007cc',padding:'12px 20px'}}>Illustrated from repo commands and saved outputs</div>
    <SourceTag label="SOURCE · README.md · scripts/transcribe.py · video/README.md"/>
  </AbsoluteFill>;
};

const ResultPanel: React.FC<{f: number}> = ({f}) => {
  const rows = [
    ['audio_file', result.audio_file],
    ['audio_sha256', `${result.audio_sha256.slice(0,20)}…`],
    ['words', `${result.word_count} aligned entries`],
    ['speaker', '0 / 1'],
    ['alignment.error', String(result.alignment_error)],
  ];
  return <AbsoluteFill style={{background:bg,color:'#eff4eb',fontFamily:'Inter, Arial, sans-serif',padding:'76px 100px'}}>
    <div style={{color:green,fontSize:23,fontWeight:800,letterSpacing:4}}>SAVED MODEL RESPONSE</div>
    <div style={{fontSize:72,fontWeight:800,letterSpacing:-3,marginTop:20}}>From waveform to verifiable words.</div>
    <div style={{display:'flex',gap:50,marginTop:60}}>
      <div style={{width:610,background:'#182318',border:'2px solid #526c43',borderRadius:18,padding:'38px 45px'}}>
        <div style={{fontSize:25,color:green,fontWeight:800,letterSpacing:2}}>INPUT</div>
        <div style={{fontSize:39,fontWeight:740,marginTop:30}}>demo_conversation.wav</div>
        <div style={{fontSize:28,color:'#b5c4ac',marginTop:22}}>Mono · 16 kHz · PCM16</div>
        <div style={{fontSize:27,color:'#b5c4ac',marginTop:18}}>34.24 seconds of source audio</div>
        <div style={{height:8,background:'#31482a',borderRadius:8,marginTop:58}}><div style={{height:'100%',width:`${Math.min(100,f/120*100)}%`,background:green,borderRadius:8}}/></div>
      </div>
      <div style={{flex:1,background:'#111a10',border:'2px solid #526c43',borderRadius:18,padding:'38px 45px',boxShadow:'0 30px 60px #0008'}}>
        <div style={{fontSize:25,color:green,fontWeight:800,letterSpacing:2}}>OUTPUT · REAL JSON FIELDS</div>
        {rows.map(([k,v],i)=>{const t=ramp(f,10+i*16,12,EASE.out);return <div key={k} style={{display:'flex',gap:28,borderBottom:'1px solid #40533b',padding:'17px 0',opacity:t,transform:`translateX(${(1-t)*20}px)`}}><div style={{width:245,flexShrink:0,color:'#a3bc92',font:'25px ui-monospace, monospace'}}>{k}</div><div style={{font:'27px ui-monospace, monospace',overflowWrap:'anywhere'}}>{v}</div></div>;})}
      </div>
    </div>
    <div style={{position:'absolute',left:100,right:100,bottom:130,fontSize:31,fontWeight:700,opacity:ramp(f,102,15,EASE.out)}}><span style={{color:green}}>✓</span> Caption export checks the source audio hash and alignment.</div>
    <SourceTag label="SOURCE · runs/demo_conversation.json · scripts/build_gallery.py"/>
  </AbsoluteFill>;
};

const AudioToResult: React.FC = () => {
  const f=useCurrentFrame();
  return f<172?<AbsoluteFill><VoiceWaveformLive/><div style={{position:'absolute',left:92,top:55,color:green,font:'800 24px Inter, Arial, sans-serif',letterSpacing:3}}>REAL SOURCE WAV · SAMPLED AMPLITUDE</div><SourceTag label="SOURCE · assets/demo_conversation.wav · runs/demo_conversation.json"/></AbsoluteFill>:<ResultPanel f={f-172}/>;
};

const ConversationProof: React.FC = () => {
  const f=useCurrentFrame();
  const t=ramp(f,0,18,EASE.out);
  return <AbsoluteFill style={{background:bg,color:'#f3f7ef',fontFamily:'Inter, Arial, sans-serif',padding:'62px 95px'}}>
    <div style={{fontSize:23,fontWeight:800,letterSpacing:4,color:green}}>REAL CAPTION CLIP · MUTED EXCERPT</div>
    <div style={{fontSize:63,fontWeight:800,letterSpacing:-2,marginTop:14}}>A dialogue you can inspect.</div>
    <div style={{position:'absolute',left:95,top:215,width:1340,height:754,border:`2px solid ${green}`,borderRadius:16,overflow:'hidden',boxShadow:'0 30px 80px #000b',opacity:t,transform:`translateY(${(1-t)*35}px)`}}>
      <OffthreadVideo src={staticFile('shotcraft/conversation-caption.mp4')} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/>
    </div>
    <div style={{position:'absolute',left:1495,top:250,width:330}}>
      {[['34.24 s','source audio'],['6','speaker turns'],['90','timed words']].map(([value,label],i)=>{const p=ramp(f,23+i*21,14,EASE.out);return <div key={label} style={{borderTop:'2px solid #456238',padding:'22px 0 31px',opacity:p,transform:`translateX(${(1-p)*22}px)`}}><div style={{color:green,fontSize:58,fontWeight:800}}>{value}</div><div style={{fontSize:24,color:'#becdb5',marginTop:3}}>{label}</div></div>;})}
    </div>
    <div style={{position:'absolute',left:95,bottom:31,color:'#aebca6',fontSize:19}}>SOURCE · video/out/conversation-caption.mp4 · runs/demo_conversation.json · scripts/finalize_run.py</div>
  </AbsoluteFill>;
};

const views = [SpotlightSource,TerminalScene,AudioToResult,ConversationProof,GroupPhoto];
export const SHOTCRAFT_PILOT_DURATION = pilot.scenes.reduce((sum,scene)=>sum+scene.durationFrames,0);

export const ShotcraftPilot: React.FC = () => {
  let start=0;
  return <AbsoluteFill style={{background:bg}}>{pilot.scenes.map((scene,i)=>{
    const from=start;start+=scene.durationFrames;
    const View=views[i];
    return <Sequence key={i} from={from} durationInFrames={scene.durationFrames}>
      <View/>
      <Audio src={staticFile(scene.audio)}/>
    </Sequence>;
  })}</AbsoluteFill>;
};
