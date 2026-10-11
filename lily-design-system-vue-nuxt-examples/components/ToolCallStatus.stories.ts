import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolCallStatus from './ToolCallStatus.vue';

const meta = {
  title: 'Headless/ToolCallStatus',
  component: ToolCallStatus,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
