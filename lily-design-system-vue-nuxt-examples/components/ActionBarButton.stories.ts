import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ActionBarButton from './ActionBarButton.vue';

const meta = {
  title: 'Headless/ActionBarButton',
  component: ActionBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
