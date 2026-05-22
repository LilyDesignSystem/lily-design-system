import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupWindow from './MockupWindow';

const meta = {
  title: 'Examples/MockupWindow',
  component: MockupWindow,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
