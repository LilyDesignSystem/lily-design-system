import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActionBar from './ActionBar';

const meta = {
  title: 'Examples/ActionBar',
  component: ActionBar,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
