import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NederlandIdentiteitskaartNummerView from './NederlandIdentiteitskaartNummerView';

const meta = {
  title: 'Examples/NederlandIdentiteitskaartNummerView',
  component: NederlandIdentiteitskaartNummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandIdentiteitskaartNummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandIdentiteitskaartNummerView' }
};
