import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolCallOutput from './ToolCallOutput.vue';

const meta = {
  title: 'Headless/ToolCallOutput',
  component: ToolCallOutput,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallOutput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
