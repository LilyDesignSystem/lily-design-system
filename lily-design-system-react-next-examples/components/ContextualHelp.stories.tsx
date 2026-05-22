import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContextualHelp from './ContextualHelp';

const meta = {
  title: 'Examples/ContextualHelp',
  component: ContextualHelp,
  tags: ['autodocs']
} satisfies Meta<typeof ContextualHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
