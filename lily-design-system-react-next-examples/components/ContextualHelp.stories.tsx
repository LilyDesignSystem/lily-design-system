import type { Meta, StoryObj } from '@storybook/react-vite';
import ContextualHelp from './ContextualHelp';

const meta = {
  title: 'Headless/ContextualHelp',
  component: ContextualHelp,
  tags: ['autodocs']
} satisfies Meta<typeof ContextualHelp>;

export default meta;
type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {};
