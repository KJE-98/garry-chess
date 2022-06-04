import * as React from 'react';

export interface LabeledSwitchMaterialUiProps extends React.Props<LabeledSwitchMaterialUi> {
  aspectRatioSwitch?: number;
  defaultKnobOnLeft?: boolean;
  disabled?: boolean;
  knobOnLeft?: boolean;
  knobSize?: number;
  labelLeft: string;
  labelRight: string;
  onChange?: (knobOnLeft: boolean) => void;
  style?: React.CSSProperties;
  styleLabelLeft?: React.CSSProperties;
  styleLabelRight?: React.CSSProperties;
  styleSwitch?: React.CSSProperties;
}

declare class LabeledSwitchMaterialUi extends React.Component<LabeledSwitchMaterialUiProps> {}

declare module 'labeled-switch-material-ui' {}

export default LabeledSwitchMaterialUi;
