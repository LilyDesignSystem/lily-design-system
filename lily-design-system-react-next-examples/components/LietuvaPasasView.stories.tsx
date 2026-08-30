import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LietuvaPasasView from './LietuvaPasasView';

const meta = {
  title: 'Examples/LietuvaPasasView',
  component: LietuvaPasasView,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaPasasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaPasasView' }
};
