import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FloatButton from './FloatButton.vue';

const meta = {
  title: 'Headless/FloatButton',
  component: FloatButton,
  tags: ['autodocs']
} satisfies Meta<typeof FloatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
