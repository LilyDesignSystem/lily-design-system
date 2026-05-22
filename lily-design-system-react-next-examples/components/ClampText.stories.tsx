import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ClampText from './ClampText';

const meta = {
  title: 'Examples/ClampText',
  component: ClampText,
  tags: ['autodocs']
} satisfies Meta<typeof ClampText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
