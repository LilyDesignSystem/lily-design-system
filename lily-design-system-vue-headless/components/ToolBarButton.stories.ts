import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolBarButton from './ToolBarButton.vue';

const meta = {
  title: 'Headless/ToolBarButton',
  component: ToolBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ToolBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
