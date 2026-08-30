import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenskoPasView from './SlovenskoPasView';

const meta = {
  title: 'Examples/SlovenskoPasView',
  component: SlovenskoPasView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoPasView' }
};
