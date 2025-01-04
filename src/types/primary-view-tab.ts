import { EPrimaryViewTabType } from './primary-view-tab-type.enum.ts';

export type TPrimaryViewTab = {
  type: EPrimaryViewTabType;
  name: string;
  sections?: { title: string; click: () => void }[];
  onClick?: () => void;
  color?: string;
};
