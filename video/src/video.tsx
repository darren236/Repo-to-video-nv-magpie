import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShotcraftInkScene} from './shotcraft-ink';

export type Scene = {
  title: string;
  narration: string;
  nodes: string[];
  visual: 'flow' | 'cards' | 'code';
  sourcePaths: string[];
  audio: string;
  durationFrames: number;
};

export type VideoProps = {repoName: string; commit: string; scenes: Scene[]; template?: 'standard' | 'shotcraft-ink'};

const colors = {bg: '#0b1017', panel: '#17212d', edge: '#33495a', text: '#f3f8fb', muted: '#9ab0bd', accent: '#76b900', glow: '#9de343'};

const SceneView: React.FC<{scene: Scene; index: number; total: number; repoName: string; commit: string}> = ({scene, index, total, repoName, commit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const progress = Math.min(1, frame / Math.max(1, scene.durationFrames));
  const cues = scene.narration.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
  const totalCueLength = cues.reduce((sum, cue) => sum + cue.length, 0);
  const spokenProgress = Math.min(1, frame / Math.max(1, scene.durationFrames - Math.ceil(fps * 0.35)));
  let cumulative = 0;
  const activeCue = cues.find((cue) => {
    cumulative += cue.length / totalCueLength;
    return spokenProgress <= cumulative;
  }) ?? cues[cues.length - 1];
  return <AbsoluteFill style={{backgroundColor: colors.bg, color: colors.text, fontFamily: 'Inter, Arial, sans-serif', padding: '76px 100px'}}>
    <div style={{position: 'absolute', width: 950, height: 950, borderRadius: '50%', right: -300, top: -470, background: 'radial-gradient(circle, #294317 0%, transparent 65%)', opacity: 0.65}} />
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 27, fontWeight: 700, letterSpacing: 1.5, color: colors.accent}}>
      <span>REPO / VIDEO</span><span style={{color: colors.muted, fontSize: 22}}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
    <div style={{marginTop: 84, opacity: entry, transform: `translateY(${(1 - entry) * 32}px)`}}>
      <div style={{color: colors.muted, fontSize: 28, marginBottom: 20}}>{repoName}</div>
      <h1 style={{fontSize: 76, lineHeight: 1.08, maxWidth: 1550, margin: 0, fontWeight: 800, letterSpacing: -2}}>{scene.title}</h1>
    </div>
    <div style={{display: 'flex', gap: 25, marginTop: 90, alignItems: 'stretch'}}>
      {scene.nodes.map((node, i) => {
        const reveal = interpolate(frame, [18 + i * 12, 36 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return <React.Fragment key={`${i}-${node}`}>
          {i > 0 && scene.visual === 'flow' && <div style={{alignSelf: 'center', color: colors.accent, fontSize: 53, opacity: reveal}}>→</div>}
          <div style={{flex: 1, minWidth: 0, minHeight: 240, maxWidth: scene.visual === 'flow' ? 480 : undefined, borderRadius: 24, background: `linear-gradient(145deg, ${colors.panel}, #101923)`, border: `2px solid ${colors.edge}`, boxShadow: `0 20px 50px #0005`, padding: '34px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: reveal, transform: `translateY(${(1 - reveal) * 36}px)`}}>
            <div style={{fontSize: 25, color: colors.accent, fontWeight: 800}}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{fontSize: node.length > 24 ? 29 : node.length > 18 ? 34 : 39, lineHeight: 1.2, fontFamily: scene.visual === 'code' ? 'monospace' : undefined, overflowWrap: 'anywhere'}}>{node}</div>
          </div>
        </React.Fragment>;
      })}
    </div>
    <div style={{position: 'absolute', bottom: 135, left: 240, right: 240, minHeight: 112, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: '#070d15dd', border: `1px solid ${colors.edge}`, padding: '12px 30px', textAlign: 'center', fontSize: 33, lineHeight: 1.18, fontWeight: 700}}>{activeCue}</div>
    <div style={{position: 'absolute', bottom: 76, left: 100, right: 100, display: 'flex', justifyContent: 'space-between', gap: 50, alignItems: 'end'}}>
      <div style={{fontSize: 20, color: colors.muted, maxWidth: 1350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>SOURCE · {scene.sourcePaths.join(' · ') || repoName}</div>
      <div style={{fontSize: 20, color: colors.muted, fontFamily: 'monospace'}}>commit {commit.slice(0, 8)}</div>
    </div>
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${progress * 100}%`, backgroundColor: colors.accent}} />
    {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
  </AbsoluteFill>;
};

export const RepoExplainer: React.FC<VideoProps> = ({repoName, commit, scenes, template = 'standard'}) => {
  let start = 0;
  return <AbsoluteFill style={{backgroundColor: colors.bg}}>{scenes.map((scene, index) => {
    const from = start;
    start += scene.durationFrames;
    return <Sequence key={`${index}-${scene.title}`} from={from} durationInFrames={scene.durationFrames}>
      {template === 'shotcraft-ink'
        ? <ShotcraftInkScene scene={scene} index={index} total={scenes.length} repoName={repoName} commit={commit} />
        : <SceneView scene={scene} index={index} total={scenes.length} repoName={repoName} commit={commit} />}
    </Sequence>;
  })}</AbsoluteFill>;
};
