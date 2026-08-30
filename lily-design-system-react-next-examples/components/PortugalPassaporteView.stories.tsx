import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PortugalPassaporteView from './PortugalPassaporteView';

const meta = {
  title: 'Examples/PortugalPassaporteView',
  component: PortugalPassaporteView,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalPassaporteView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalPassaporteView' }
};
