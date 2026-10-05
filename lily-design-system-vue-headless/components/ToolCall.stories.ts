import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolCall from './ToolCall.vue';

const meta = {
  title: 'Headless/ToolCall',
  component: ToolCall,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
