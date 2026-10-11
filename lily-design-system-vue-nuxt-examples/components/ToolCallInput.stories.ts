import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolCallInput from './ToolCallInput.vue';

const meta = {
  title: 'Headless/ToolCallInput',
  component: ToolCallInput,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
