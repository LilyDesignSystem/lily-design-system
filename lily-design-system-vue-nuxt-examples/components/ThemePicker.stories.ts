import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemePicker from './ThemePicker.vue';

const meta = {
  title: 'Examples/ThemePicker',
  component: ThemePicker,
  tags: ['autodocs']
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
