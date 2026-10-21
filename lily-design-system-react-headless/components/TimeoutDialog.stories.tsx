import type { Meta, StoryObj } from '@storybook/react-vite';
import TimeoutDialog from './TimeoutDialog';

const meta = {
  title: 'Headless/TimeoutDialog',
  component: TimeoutDialog,
  tags: ['autodocs']
} satisfies Meta<typeof TimeoutDialog>;

export default meta;
type Story = StoryObj<typeof TimeoutDialog>;

export const Default: Story = {};
