import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BelgiqueNumeroDeRegistreNationalView from './BelgiqueNumeroDeRegistreNationalView';

const meta = {
  title: 'Examples/BelgiqueNumeroDeRegistreNationalView',
  component: BelgiqueNumeroDeRegistreNationalView,
  tags: ['autodocs']
} satisfies Meta<typeof BelgiqueNumeroDeRegistreNationalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BelgiqueNumeroDeRegistreNationalView' }
};
