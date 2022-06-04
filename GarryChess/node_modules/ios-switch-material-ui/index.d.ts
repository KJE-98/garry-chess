import * as React from 'react';

export interface IosSwitchMaterialUiProps extends React.Props<IosSwitchMaterialUi> {
  aspectRatio?: number;
  colorKnobOnLeft?: string;
  colorKnobOnRight?: string;
  colorSwitch?: string;
  defaultKnobOnLeft?: boolean;
  disabled?: boolean;
  knobOnLeft?: boolean;
  knobSize?: number;
  onChange?: (knobOnLeft: boolean) => void;
}

declare class IosSwitchMaterialUi extends React.Component<IosSwitchMaterialUiProps> {}

declare module 'ios-switch-material-ui' {}

export default IosSwitchMaterialUi;
