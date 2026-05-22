import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Hint from './Hint';

const meta = {
  title: 'Examples/Hint',
  component: Hint,
  tags: ['autodocs']
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
