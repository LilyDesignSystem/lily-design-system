import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CodeBlock from './CodeBlock';

const meta = {
  title: 'Examples/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs']
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
