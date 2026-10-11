import type { Meta, StoryObj } from '@storybook/react-vite';
import CodeBlock from './CodeBlock';

const meta = {
  title: 'Headless/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs']
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
