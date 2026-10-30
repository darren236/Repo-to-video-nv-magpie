// Adapted from Shotcraft demos/interaction/voice-waveform-live/VoiceWaveformLive.tsx at commit 1266a3e.
// The 64-bar rolling signal, word reveal and submit collapse use a real source WAV
// and saved aligned word times from nemotron-transcribe-demo.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASE, FONT, mix, ramp } from './Polish';
import { LOOKS, Stage, alpha } from './Look';
import levels from './source-audio-levels.json';
import words from './source-words.json';


export const VOICE_WAVEFORM_LIVE_DURATION = 172;

const L = LOOKS.lime;

// Sampled RMS from assets/demo_conversation.wav, the exact WAV behind the saved result.
// Preserve Shotcraft's rolling 64-bar sampling and submit collapse; heights follow real audio.
const envelope = (t: number) => {
  const x = t - 15; // source excerpt starts after the opening hold
  if (x < 0) return 0;
  const i = Math.floor(x);
  const q = Math.max(0, Math.min(1, x - i));
  const a = levels[Math.min(i, levels.length - 1)] ?? 0;
  const b = levels[Math.min(i + 1, levels.length - 1)] ?? 0;
  return Math.min(1, (a + (b - a) * q) * 1.35);
};

const N_BARS = 64;
const SCROLL = 1.6; // 帧/采样点：滚动速度
const MAX_H = 150;
const SUBMIT = 126;

// 逐词转写：词在它那一拍的音节起点出现
const LINES: { w: string; at: number }[][] = [words.slice(0, 8), words.slice(8)];

const CAP = { w: 1240, h: 196, cy: 760 };
const TEXT_CY = 372;

export const VoiceWaveformLive: React.FC = () => {
  const f = useCurrentFrame();

  // ── 入场 ──
  const inT = ramp(f, 0, 14, EASE.snappy);
  const labelT = ramp(f, 6, 12, EASE.out);

  // ── 提交 ──
  const submitted = f >= SUBMIT;
  const btnPress = interpolate(f, [SUBMIT, SUBMIT + 3, SUBMIT + 9], [1, 0.82, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const collapse = mix(1, 0.06, ramp(f, SUBMIT, 12, EASE.exit));
  const arrowOut = ramp(f, SUBMIT + 1, 6, EASE.exit);
  const checkIn = ramp(f, SUBMIT + 4, 8, EASE.overshoot);
  const toBubble = ramp(f, SUBMIT + 2, 22, EASE.swift);
  const bubbleFill = ramp(f, SUBMIT + 6, 10, EASE.out);
  const sentT = ramp(f, SUBMIT + 14, 12, EASE.out);
  const idle = ramp(f, SUBMIT + 14, 14, EASE.swift); // 胶囊退回待机

  // ── 声纹 ──
  const bars = Array.from({ length: N_BARS }, (_, i) => {
    const sampleT = f - (N_BARS - 1 - i) * SCROLL; // 最右条是"现在"，越靠左越旧
    const env = sampleT < 0 ? 0 : envelope(sampleT);
    const center = Math.pow(Math.sin((i / (N_BARS - 1)) * Math.PI), 0.8);
    const jitter = 0.75 + 0.25 * Math.sin(i * 1.9 + sampleT * 0.5);
    return Math.max(6, env * center * jitter * MAX_H * collapse);
  });
  const nowEnv = submitted ? 0 : envelope(f);
  const level = (bars.slice(-12).reduce((a, b) => a + b, 0) / 12 / MAX_H) * collapse;

  // 计时（说话时长，提交后停住）
  const secs = Math.max(0, Math.min(f - 15, SUBMIT - 15)) / 30;
  const timer = `0:${String(Math.floor(Math.max(0, secs - 0.4))).padStart(2, '0')}`;

  // 转写尾光标：说话中常亮、停顿闪烁、提交后消失
  const lastAt = LINES.flat().filter((w) => f >= w.at).pop()?.at ?? -99;
  const talking = nowEnv > 0.05;
  const caretOn = !submitted && f > 14 && (talking || Math.floor((f - lastAt) / 8) % 2 === 0);

  // 转写 → 气泡：上移 + 缩到 0.72
  const textScale = mix(1, 0.72, toBubble);
  const textY = mix(TEXT_CY, 330, toBubble);
  const hintO = ramp(f, 4, 10, EASE.out) * (1 - ramp(f, 15, 4, EASE.linear)); // 开口前的提示语
  const inkToWhite = bubbleFill;

  const word = (w: { w: string; at: number }, k: number) => {
    const p = ramp(f, w.at, 8, EASE.snappy);
    const fresh = 1 - ramp(f, w.at + 3, 6, EASE.linear); // 刚说出 → 赤陶，之后沉成墨
    const c = inkToWhite > 0 ? mixColor(L.ink, L.onAccent, inkToWhite) : mixColor(L.ink, L.accent, fresh);
    return (
      <span key={k} style={{
        display: 'inline-block', marginRight: '0.24em', opacity: p, color: c,
        filter: p < 1 ? `blur(${((1 - p) * 10).toFixed(2)}px)` : undefined,
        transform: `translateY(${((1 - p) * 0.22).toFixed(3)}em)`,
      }}>
        {w.w}
        {/* 尾光标挂在最后一个已出现的词后面 */}
        {caretOn && w.at === lastAt && (
          <span style={{ display: 'inline-block', width: 6, height: '0.8em', verticalAlign: '-0.08em', marginLeft: '0.06em', marginRight: '-0.12em', borderRadius: 3, background: L.accent }} />
        )}
      </span>
    );
  };

  return (
    <AbsoluteFill style={{ background: L.bg[1], overflow: 'hidden', fontFamily: FONT.sans }}>
      <Stage look={L} keyLight={{ x: 0.3, y: 0.0 }} fill={{ x: 0.78, y: 0.9 }} breathe={0.4}>
        {/* 胶囊下的地面暖光：随"现在"的音量亮灭 */}
        <div style={{
          position: 'absolute', left: 960 - 820, top: CAP.cy - 40, width: 1640, height: 420,
          background: `radial-gradient(ellipse 50% 46% at 50% 40%, ${alpha('#76b900', 0.08 + 0.22 * level)} 0%, ${alpha('#76b900', 0)} 70%)`,
          opacity: inT,
        }} />
      </Stage>

      {/* ── 实时转写 / 消息气泡 ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: textY, height: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      }}>
        <div style={{ position: 'relative', transform: `translateY(-50%) scale(${textScale.toFixed(4)})`, transformOrigin: '50% 50%' }}>
          {/* 气泡底 */}
          <div style={{
            position: 'absolute', left: -64, right: -64 + 0, top: -44, bottom: -44, borderRadius: 64,
            background: L.accent, opacity: bubbleFill,
            borderBottomRightRadius: mix(64, 18, bubbleFill),
            boxShadow: `0 30px 70px -26px ${alpha(L.shadow, 0.55 * bubbleFill)}, 0 8px 20px -8px ${alpha(L.shadow, 0.3 * bubbleFill)}`,
          }} />
          <div style={{ position: 'relative', fontSize: 66, fontWeight: 760, letterSpacing: '-0.035em', lineHeight: 1.08, textAlign: 'left', whiteSpace: 'nowrap' }}>
            {LINES.map((line, li) => (
              <div key={li} style={{ minHeight: '1.08em' }}>
                {line.map((w, k) => word(w, k))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 开口前的提示语：首词落下前淡出（开场上半屏不空） */}
      {hintO > 0.01 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: TEXT_CY - 52, textAlign: 'center', fontSize: 66, fontWeight: 760, letterSpacing: '-0.035em', color: alpha(L.ink3, 0.55), opacity: hintO, filter: `blur(${((1 - hintO) * 6).toFixed(2)}px)` }}>
          A real source WAV…
        </div>
      )}

      {/* Sent 行 */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 492, textAlign: 'center', fontSize: 32, fontWeight: 550, color: L.ink2,
        opacity: sentT, transform: `translateY(${((1 - sentT) * 16).toFixed(2)}px)`,
      }}>
        <span style={{ color: L.accent }}>✓</span>&nbsp; Saved response · 90 timed words
      </div>

      {/* 标签：Shotcraft is listening */}
      <div style={{
        position: 'absolute', left: 960 - CAP.w / 2 + 24, top: CAP.cy - CAP.h / 2 - 62, display: 'flex', alignItems: 'center', gap: 14,
        fontSize: 32, fontWeight: 600, color: L.ink2, letterSpacing: '-0.01em',
        opacity: labelT * (1 - idle), transform: `translateY(${((1 - labelT) * 10).toFixed(2)}px)`,
      }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: L.accent, boxShadow: `0 0 0 ${(4 + 6 * nowEnv).toFixed(1)}px ${alpha(L.accent, 0.18)}` }} />
        Source WAV · conversation excerpt
      </div>

      {/* ── 胶囊 ── */}
      <div style={{
        position: 'absolute', left: 960 - CAP.w / 2, top: CAP.cy - CAP.h / 2 + 24 * idle, width: CAP.w, height: CAP.h, borderRadius: CAP.h / 2,
        opacity: inT, transform: `scale(${(mix(1.04, 1, inT) * mix(1, 0.94, idle)).toFixed(4)})`,
        filter: inT < 1 ? `blur(${((1 - inT) * 6).toFixed(2)}px)` : undefined,
        background: 'linear-gradient(180deg, #222b1c 0%, #182116 100%)',
        boxShadow: `inset 0 1.5px 0 #ffffff, inset 0 0 0 1px rgba(70,45,20,0.07), 0 2px 4px rgba(58,36,16,0.08), 0 40px 80px -30px ${alpha(L.shadow, 0.45)}, 0 14px 30px -12px ${alpha(L.shadow, 0.22)}`,
        display: 'flex', alignItems: 'center', padding: '0 38px', gap: 30, boxSizing: 'border-box',
      }}>
        {/* 麦克风钮：赤陶底，说话时外扩呼吸环 */}
        <div style={{ position: 'relative', width: 120, height: 120, flex: 'none' }}>
          {[0, 1].map((k) => (
            <div key={k} style={{
              position: 'absolute', inset: -(8 + (14 + k * 14) * nowEnv), borderRadius: '50%',
              background: alpha(L.accent, (0.14 - k * 0.06) * Math.min(1, nowEnv * 1.6)),
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: idle > 0 ? mixColor('#76b900', '#66715b', idle) : 'linear-gradient(160deg, #8ac928, #416b0b)',
            boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.35), 0 8px 20px -8px ${alpha('#416b0b', 0.6 * (1 - idle))}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill="none">
              <rect x={8.5} y={3} width={7} height={12} rx={3.5} fill="#f4f7ec" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" stroke="#f4f7ec" strokeWidth={1.9} strokeLinecap="round" />
              <path d="M12 18v3M9 21h6" stroke="#f4f7ec" strokeWidth={1.9} strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 声纹 */}
        <div style={{
          flex: 1, height: 160, display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 14%, #000 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0%, #000 14%, #000 100%)',
        }}>
          {bars.map((h, i) => {
            const k = Math.min(1, h / MAX_H);
            const age = i / (N_BARS - 1); // 0 = 最旧
            const quiet = h <= 7 || collapse < 0.25;
            return (
              <div key={i} style={{
                flex: 1, height: h, borderRadius: 99,
                background: quiet
                  ? alpha(L.ink3, 0.55)
                  : `linear-gradient(180deg, ${alpha('#a8db3a', 0.6 + 0.4 * age)} 0%, ${alpha(L.accent, 0.65 + 0.35 * age)} 50%, ${alpha('#a8db3a', 0.6 + 0.4 * age)} 100%)`,
                boxShadow: !quiet && i === N_BARS - 1 && !submitted ? `0 0 14px ${alpha(L.accent, 0.5 * k)}` : undefined,
              }} />
            );
          })}
        </div>

        {/* 计时 */}
        <div style={{ fontSize: 32, fontWeight: 600, color: L.ink2, fontVariantNumeric: 'tabular-nums', width: 70, textAlign: 'right', flex: 'none' }}>{timer}</div>

        {/* 提交钮：墨色圆 + 上箭头；提交时箭头上飞、对勾落入 */}
        <div style={{
          position: 'relative', width: 120, height: 120, borderRadius: 60, flex: 'none', overflow: 'hidden',
          background: 'linear-gradient(180deg, #2c241b, #191410)', transform: `scale(${btnPress.toFixed(4)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.14), 0 10px 24px -8px ${alpha(L.shadow, 0.6)}`,
        }}>
          <svg width={52} height={52} viewBox="0 0 24 24" style={{ position: 'absolute', opacity: 1 - arrowOut, transform: `translateY(${(-30 * arrowOut).toFixed(2)}px)` }}>
            <path d="M12 20V5M12 5l-6.5 6.5M12 5l6.5 6.5" stroke="#f4f7ec" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          {checkIn > 0.001 && (
            <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: 'absolute', opacity: Math.min(1, checkIn * 1.4), transform: `translateY(${(16 * (1 - checkIn)).toFixed(2)}px) scale(${(0.7 + 0.3 * checkIn).toFixed(3)})` }}>
              <path d="M5.5 12.5l4.2 4.2L18.5 7.8" stroke="#f4f7ec" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 两个 hex 颜色按 t 混合 → rgb()
function mixColor(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a);
  const B = p(b);
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
}
