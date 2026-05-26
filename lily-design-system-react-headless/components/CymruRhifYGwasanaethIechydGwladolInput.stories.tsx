import type { Meta, StoryObj } from '@storybook/react-vite';
import CymruRhifYGwasanaethIechydGwladolInput from './CymruRhifYGwasanaethIechydGwladolInput';

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolInput',
  component: CymruRhifYGwasanaethIechydGwladolInput,
  tags: ['autodocs']
} satisfies Meta<typeof CymruRhifYGwasanaethIechydGwladolInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CymruRhifYGwasanaethIechydGwladolInput' }
};
