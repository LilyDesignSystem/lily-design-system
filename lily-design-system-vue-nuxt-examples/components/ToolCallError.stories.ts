import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolCallError from './ToolCallError.vue';

const meta = {
  title: 'Headless/ToolCallError',
  component: ToolCallError,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
