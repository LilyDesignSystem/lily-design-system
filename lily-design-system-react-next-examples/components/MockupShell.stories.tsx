import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupShell from './MockupShell';

const meta = {
  title: 'Examples/MockupShell',
  component: MockupShell,
  tags: ['autodocs']
} satisfies Meta<typeof MockupShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
