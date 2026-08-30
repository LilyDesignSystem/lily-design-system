import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CymruRhifYGwasanaethIechydGwladolView from './CymruRhifYGwasanaethIechydGwladolView';

const meta = {
  title: 'Examples/CymruRhifYGwasanaethIechydGwladolView',
  component: CymruRhifYGwasanaethIechydGwladolView,
  tags: ['autodocs']
} satisfies Meta<typeof CymruRhifYGwasanaethIechydGwladolView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CymruRhifYGwasanaethIechydGwladolView' }
};
