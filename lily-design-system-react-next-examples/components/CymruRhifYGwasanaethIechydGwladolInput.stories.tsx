import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CymruRhifYGwasanaethIechydGwladolInput from './CymruRhifYGwasanaethIechydGwladolInput';

const meta = {
  title: 'Examples/CymruRhifYGwasanaethIechydGwladolInput',
  component: CymruRhifYGwasanaethIechydGwladolInput,
  tags: ['autodocs']
} satisfies Meta<typeof CymruRhifYGwasanaethIechydGwladolInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CymruRhifYGwasanaethIechydGwladolInput' }
};
