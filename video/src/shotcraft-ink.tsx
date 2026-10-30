import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from './video';

// Original, narration-driven adaptation of video-shotcraft's Ink Press visual
// language and its paper-title-card, spotlight-hero-card, and deck-deal-flyin
// recipes. The upstream promo's fixed timeline, screenshots, and audio are not used.
const ink = '#211c17';
const amber = '#955905';
const muted = '#6e675e';
const paper = '#f2eee6';
const serif = 'Georgia, "Times New Roman", serif';
const mono = '"SFMono-Regular", Consolas, monospace';
const ease = Easing.bezier(0.2, 0.75, 0.3, 1);

const reveal = (frame: number, start: number, length = 18) => interpolate(frame, [start, start + length], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
});

const activeSentence = (scene: Scene, frame: number, fps: number) => {
  const sentences = scene.narration.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
  const length = sentences.reduce((sum, sentence) => sum + sentence.length, 0);
  if (!length) return scene.narration;
  const progress = Math.min(1, frame / Math.max(1, scene.durationFrames - Math.ceil(fps * 0.35)));
  let cumulative = 0;
  return sentences.find((sentence) => {
    cumulative += sentence.length / length;
    return progress <= cumulative;
  }) ?? sentences[sentences.length - 1];
};

const WordTitle: React.FC<{title: string; frame: number; large?: boolean}> = ({title, frame, large = false}) => {
  const words = title.split(/\s+/).filter(Boolean);
  return <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 17, rowGap: 3, maxWidth: 1640}}>
    {words.map((word, i) => {
      const t = reveal(frame, 3 + i * 4, 10);
      return <span key={`${i}-${word}`} style={{display: 'inline-block', fontFamily: serif, fontSize: large ? 91 : 76,
        fontWeight: 600, lineHeight: 1.13, letterSpacing: '-0.035em', color: i === words.length - 1 ? amber : ink,
        fontStyle: i === words.length - 1 ? 'italic' : 'normal', opacity: t,
        filter: `blur(${(1 - t) * 7}px)`, transform: `scale(${1.18 - 0.18 * t}) translateY(${(1 - t) * 12}px)`}}>{word}</span>;
    })}
  </div>;
};

const PaperCard: React.FC<{label: string; number: number; frame: number; start: number; variant: 'flow' | 'deal' | 'hero' | 'outro'}> = ({label, number, frame, start, variant}) => {
  const t = reveal(frame, start, variant === 'deal' ? 15 : 20);
  const offX = variant === 'deal' ? -420 - number * 65 : 0;
  const offY = variant === 'hero' ? 125 : variant === 'outro' ? 160 : 65;
  const rotate = variant === 'deal' ? -13 + number * 3 : variant === 'outro' ? (number % 2 ? 5 : -5) : 0;
  return <div style={{flex: 1, minWidth: 0, minHeight: 238, borderRadius: 8, background: '#fffdfa',
    border: `2px solid ${variant === 'hero' && number === 1 ? amber : '#d9cfc1'}`,
    boxShadow: `0 ${14 + (1 - t) * 28}px ${34 + (1 - t) * 20}px #4b382530`, padding: '28px 32px',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: t,
    transform: `translate(${offX * (1 - t)}px, ${offY * (1 - t)}px) rotate(${rotate * (1 - t)}deg) scale(${0.92 + 0.08 * t})`}}>
    <div style={{fontFamily: mono, fontSize: 22, color: amber, letterSpacing: 2}}>{String(number).padStart(2, '0')}</div>
    <div style={{fontFamily: serif, fontSize: label.length > 24 ? 36 : label.length > 18 ? 41 : 48,
      fontWeight: 600, lineHeight: 1.15, overflowWrap: 'anywhere', color: ink}}>{label}</div>
    <div style={{width: 76, height: 4, background: amber, transformOrigin: 'left', transform: `scaleX(${reveal(frame, start + 13, 15)})`}} />
  </div>;
};

const Visual: React.FC<{scene: Scene; index: number; total: number; frame: number}> = ({scene, index, total, frame}) => {
  if (scene.visual === 'code' && index !== total - 1) {
    return <div style={{height: 305, borderRadius: 10, overflow: 'hidden', background: '#26231f',
      boxShadow: '0 22px 50px #4b382533', border: '1px solid #4d4237'}}>
      <div style={{height: 48, background: '#39342e', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 20}}>
        {[0, 1, 2].map(i => <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: ['#b56e56', '#c7a35e', '#8b9c68'][i]}} />)}
        <span style={{fontFamily: mono, fontSize: 18, color: '#c9baa4', marginLeft: 20}}>source trail</span>
      </div>
      <div style={{padding: '27px 42px', display: 'grid', gap: 21}}>
        {scene.nodes.map((node, i) => {
          const t = reveal(frame, 25 + i * 19, 15);
          const letters = Math.ceil(t * node.length);
          return <div key={`${i}-${node}`} style={{fontFamily: mono, fontSize: 31, color: '#f0e8da', opacity: t}}>
            <span style={{color: '#c38b47', paddingRight: 22}}>{String(i + 1).padStart(2, '0')}</span>{node.slice(0, letters)}{t < 1 && t > 0 ? '▌' : ''}
          </div>;
        })}
      </div>
    </div>;
  }

  const variant = index === 0 ? 'hero' : index === total - 1 ? 'outro' : scene.visual === 'flow' ? 'flow' : 'deal';
  const nodes = scene.nodes;
  const spotlight = index === 0 ? reveal(frame, 16, 24) : 0;
  return <div style={{position: 'relative', width: '100%', height: 310, display: 'flex', alignItems: 'center', gap: variant === 'flow' ? 16 : 25}}>
    {index === 0 && <div style={{position: 'absolute', inset: '-110px 5% -90px', pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 23% 48%, #e6bc754d 0%, transparent 54%)', opacity: spotlight}} />}
    {nodes.map((node, i) => <React.Fragment key={`${i}-${node}`}>
      {i > 0 && variant === 'flow' && <div style={{width: 49, height: 4, flexShrink: 0, background: amber,
        transformOrigin: 'left', transform: `scaleX(${reveal(frame, 46 + i * 20, 14)})`}} />}
      <PaperCard label={node} number={i + 1} frame={frame} start={26 + i * (variant === 'deal' ? 14 : 20)} variant={variant} />
    </React.Fragment>)}
  </div>;
};

export const ShotcraftInkScene: React.FC<{scene: Scene; index: number; total: number; repoName: string; commit: string}> = ({scene, index, total, repoName, commit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sentence = activeSentence(scene, frame, fps);
  const line = reveal(frame, 20, 25);
  const exit = interpolate(frame, [Math.max(0, scene.durationFrames - 10), scene.durationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: paper, color: ink, opacity: exit,
    backgroundImage: 'radial-gradient(ellipse 1050px 650px at 52% 25%, #fffbf2 0%, transparent 75%), repeating-linear-gradient(90deg, #a8844a08 0px, #a8844a08 1px, transparent 1px, transparent 120px)',
    padding: '68px 110px'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: mono, fontSize: 22,
      letterSpacing: 2, color: muted, textTransform: 'uppercase'}}>
      <span>{repoName} <span style={{color: amber}}> / field notes</span></span>
      <span>{String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}</span>
    </div>
    <div style={{marginTop: 62, height: 200}}>
      <WordTitle title={scene.title} frame={frame} large={index === 0 || index === total - 1} />
      <div style={{width: 225, height: 6, background: amber, marginTop: 22, transformOrigin: 'left', transform: `scaleX(${line})`}} />
    </div>
    <div style={{marginTop: 20}}><Visual scene={scene} index={index} total={total} frame={frame} /></div>
    <div style={{position: 'absolute', left: 110, right: 110, bottom: 103, minHeight: 127,
      display: 'flex', alignItems: 'center', borderTop: '2px solid #cfc2af', borderBottom: '2px solid #cfc2af',
      padding: '12px 28px', background: '#f8f3ebdc', fontFamily: serif, fontSize: 31, fontWeight: 500,
      lineHeight: 1.18, color: ink}}>{sentence}</div>
    <div style={{position: 'absolute', left: 110, right: 110, bottom: 50, display: 'flex', justifyContent: 'space-between',
      gap: 40, fontFamily: mono, fontSize: 18, color: muted}}>
      <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 1350}}>SOURCE · {scene.sourcePaths.join(' · ') || repoName}</span>
      <span style={{whiteSpace: 'nowrap'}}>commit {commit.slice(0, 8)}</span>
    </div>
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${100 * frame / Math.max(1, scene.durationFrames)}%`, background: amber}} />
    {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
  </AbsoluteFill>;
};
