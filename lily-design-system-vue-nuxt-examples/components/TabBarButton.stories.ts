import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TabBarButton from './TabBarButton.vue';

const meta = {
  title: 'Headless/TabBarButton',
  component: TabBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof TabBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
