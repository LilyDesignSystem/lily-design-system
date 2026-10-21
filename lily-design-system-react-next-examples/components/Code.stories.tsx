import type { Meta, StoryObj } from '@storybook/react-vite';
import Code from './Code';

const meta = {
  title: 'Headless/Code',
  component: Code,
  tags: ['autodocs']
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof Code>;

export const Default: Story = {};
