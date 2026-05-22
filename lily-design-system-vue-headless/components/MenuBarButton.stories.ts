import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MenuBarButton from './MenuBarButton.vue';

const meta = {
  title: 'Headless/MenuBarButton',
  component: MenuBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof MenuBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
