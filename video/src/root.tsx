import React from 'react';
import {Composition} from 'remotion';
import {RepoExplainer, type VideoProps} from './video';
import {ShotcraftPilot, SHOTCRAFT_PILOT_DURATION} from './shotcraft-production';

const defaultProps: VideoProps = {
  repoName: 'Repository',
  commit: 'preview',
  scenes: [{title: 'Repository explainer', narration: 'Preview scene.', nodes: ['Purpose', 'Architecture', 'Example'], visual: 'flow', sourcePaths: [], audio: '', durationFrames: 150}],
};

export const Root: React.FC = () => <>
  <Composition
    id="RepoExplainer"
    component={RepoExplainer}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={defaultProps.scenes.reduce((sum, scene) => sum + scene.durationFrames, 0)}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({durationInFrames: props.scenes.reduce((sum, scene) => sum + scene.durationFrames, 0)})}
  />
  <Composition
    id="ShotcraftPilot"
    component={ShotcraftPilot}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={SHOTCRAFT_PILOT_DURATION}
  />
</>;
