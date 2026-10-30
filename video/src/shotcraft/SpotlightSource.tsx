import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {EASE, ramp} from './Polish';

// Adapted from the actual SpotlightHeroCard.tsx at the pinned Shotcraft commit.
// The original page/card textures are replaced with real caption-clip frames.
// Its scan path, 18f camera push, rise/hover/reseat, two contour laps and hold remain.
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const green = '#a8db3a';
const bg = '#0b0f0a';
const pics = ['conversation.png', 'jfk.png', 'artemis.png'];
const names = ['Two-speaker dialogue', 'JFK speech', 'Artemis radio'];
const sub = ['34.24 s · 90 words', '11.00 s · 22 words', '21.97 s · 45 words'];

const Preview: React.FC<{file: string}> = ({file}) => <Img src={staticFile(`shotcraft/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>;

const SpotlightHero: React.FC<{f: number}> = ({f}) => {
  const lamp = interpolate(f, [1, 3, 4, 6], [0, 1, 0.62, 1], clamp);
  const poolX = interpolate(f, [4, 10, 13, 19, 22, 28, 34, 58], [24, 24, 72, 72, 38, 38, 50, 60], {...clamp, easing: EASE.smooth});
  const poolY = interpolate(f, [4, 10, 13, 19, 22, 28, 34, 58], [30, 30, 40, 40, 62, 62, 58, 55], {...clamp, easing: EASE.smooth});
  const push = ramp(f, 40, 18, Easing.bezier(0.35, 0, 0.2, 1));
  const rise = interpolate(f, [56, 66], [0, 1], {...clamp, easing: Easing.bezier(0.2, 1.25, 0.3, 1)});
  const reseat = interpolate(f, [124, 142], [0, 1], {...clamp, easing: Easing.bezier(0.4, 0, 0.3, 1.05)});
  const lift = rise * (1 - reseat);
  const bob = Math.sin(((f - 66) / 40) * Math.PI * 2) * 4 * lift;
  const z = 110 * lift + bob;
  const lap1 = interpolate(f, [68, 82], [0, 1], {...clamp, easing: EASE.linear});
  const lap2 = interpolate(f, [88, 108], [0, 1], {...clamp, easing: EASE.swift});
  const beamOn = (f >= 67 && f <= 83) || (f >= 87 && f <= 109);
  const beamOffset = f <= 83 ? lap1 : lap2;
  const beamOpacity = f <= 83 ? 1 : 0.62;
  const note = ramp(f, 70, 14, EASE.out);
  const line = ramp(f, 84, 12, EASE.swift);
  const cardLight = ramp(f, 38, 20, EASE.smooth);
  const shadow = `${-10 * lift}px ${10 * lift}px ${12 + 12 * lift}px rgba(0,0,0,${0.35 * lift}), ${-36 * lift}px ${48 * lift}px ${90 * lift}px rgba(0,0,0,${0.42 * lift})`;
  const cardW = 1060, cardH = 596;
  return <AbsoluteFill style={{background: bg, overflow: 'hidden', color: '#f4f7ee', fontFamily: 'Inter, Arial, sans-serif'}}>
    <div style={{position: 'absolute', inset: -120, opacity: 0.23, transform: `scale(${0.86 + 0.12 * push}) rotateY(${14 * push}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 45}}>
      {pics.map((file, i) => <div key={file} style={{width: 510, height: 287, border: '2px solid #3f5731', boxShadow: '0 30px 80px #000'}}><Preview file={file}/></div>)}
    </div>
    <AbsoluteFill style={{background: `radial-gradient(650px 570px at ${poolX}% ${poolY}%, rgba(0,0,0,0) 5%, rgba(0,0,0,.82) 82%)`, opacity: lamp * (1 - cardLight), pointerEvents: 'none'}}/>
    <div style={{position: 'absolute', left: 800, top: 268 - 36 * push, width: cardW, height: cardH, transform: `perspective(1400px) rotateY(${28 * push}deg) rotateX(${8 * push}deg) translateZ(${z}px) scale(${1 + 0.1 * push})`, transformStyle: 'preserve-3d', borderRadius: 18, boxShadow: `${shadow}, 0 0 0 2px ${green}`, overflow: 'visible'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 18, background: '#111a0e'}}><Preview file="conversation.png"/></div>
      {beamOn && lift > 0.4 && <svg width={cardW + 6} height={cardH + 6} style={{position: 'absolute', left: -3, top: -3, overflow: 'visible', filter: `drop-shadow(0 0 10px ${green})`, opacity: beamOpacity}}>
        {[5, 2.5].map((w) => <rect key={w} x={3} y={3} width={cardW} height={cardH} rx={18} fill="none" stroke={w > 3 ? green : '#f2ffe0'} strokeWidth={w} pathLength={1} strokeDasharray="0.16 1" strokeDashoffset={-beamOffset}/>)}
      </svg>}
    </div>
    <div style={{position: 'absolute', left: 100, top: 295, width: 600, opacity: note, transform: `translateY(${(1 - note) * 26}px) translateZ(${(1 - reseat) * 88}px)`, filter: note < 1 ? `blur(${(1 - note) * 4}px)` : undefined}}>
      <div style={{fontSize: 26, letterSpacing: 4, color: green, fontWeight: 800}}>REAL H100 OUTPUT</div>
      <div style={{fontSize: 82, fontWeight: 820, lineHeight: 1.02, letterSpacing: -4, marginTop: 24}}>Word by word.<br/><span style={{background: `linear-gradient(90deg, ${green} ${line * 100}%, transparent ${line * 100}%)`, color: line > 0.55 ? bg : '#f4f7ee'}}>Traceable.</span></div>
    </div>
    <div style={{position: 'absolute', left: 108, top: 74, fontSize: 22, fontWeight: 800, color: green, letterSpacing: 4}}>NEMOTRON 3.5 TRANSCRIBE</div>
    <div style={{position: 'absolute', left: 108, bottom: 70, fontSize: 26, color: '#afbea4'}}>Three saved inference recordings · one H100 · exact source audio</div>
  </AbsoluteFill>;
};

const Gallery: React.FC<{f: number}> = ({f}) => <AbsoluteFill style={{background: bg, color: '#f4f7ee', fontFamily: 'Inter, Arial, sans-serif', padding: '85px 95px'}}>
  <div style={{fontSize: 23, fontWeight: 800, letterSpacing: 4, color: green}}>THREE REAL DEMOS</div>
  <div style={{fontSize: 76, fontWeight: 800, letterSpacing: -3, marginTop: 20}}>One model. Three kinds of speech.</div>
  <div style={{display: 'flex', gap: 30, marginTop: 64}}>
    {pics.map((file, i) => {
      const t = ramp(f, i * 16, 16, EASE.overshoot);
      return <div key={file} style={{width: 555, opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 100}px) scale(${0.94 + 0.06 * t})`}}>
        <div style={{width: 555, height: 312, borderRadius: 16, overflow: 'hidden', border: `2px solid ${i === 0 ? green : '#45603b'}`, boxShadow: '0 30px 60px #0009'}}><Preview file={file}/></div>
        <div style={{fontSize: 34, fontWeight: 750, marginTop: 25}}>{names[i]}</div>
        <div style={{fontSize: 23, color: '#a5b49b', marginTop: 10}}>{sub[i]}</div>
      </div>;
    })}
  </div>
  <div style={{position: 'absolute', left: 95, bottom: 55, color: '#84927d', fontSize: 20}}>SOURCE · video/out/*.mp4 · runs/gallery_manifest.json</div>
</AbsoluteFill>;

export const SpotlightSource: React.FC = () => {
  const f = useCurrentFrame();
  return f < 172 ? <SpotlightHero f={f}/> : <Gallery f={f - 172}/>;
};
