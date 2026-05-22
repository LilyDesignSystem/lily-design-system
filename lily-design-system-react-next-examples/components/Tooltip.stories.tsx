import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tooltip from './Tooltip';

const meta = {
  title: 'Examples/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
