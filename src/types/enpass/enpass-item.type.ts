import { TEnpassIcon } from './enpass-icon.type.ts';
import { TEnpassField } from './enpass-field.type.ts';

export type TEnpassItem = {
  archived: number;
  auto_submit: number;
  category: string;
  category_name: string;
  createdAt: number;
  favorite: number;
  field_updated_at: number;
  fields: TEnpassField[];
  folders: string[];
  icon: TEnpassIcon;
  note: string;
  subtitle: string;
  template_type: string;
  title: string;
  trashed: number;
  updated_at: number;
  uuid: string;
};
