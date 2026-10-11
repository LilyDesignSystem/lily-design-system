import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Popup from './Popup.vue';

const meta = {
  title: 'Headless/Popup',
  component: Popup,
  tags: ['autodocs']
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
