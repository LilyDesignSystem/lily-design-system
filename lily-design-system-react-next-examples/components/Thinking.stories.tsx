import type { Meta, StoryObj } from '@storybook/react-vite';
import Thinking from './Thinking';

const meta = {
  title: 'Headless/Thinking',
  component: Thinking,
  tags: ['autodocs']
} satisfies Meta<typeof Thinking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Thinking", children: "Reasoning steps." }
};
