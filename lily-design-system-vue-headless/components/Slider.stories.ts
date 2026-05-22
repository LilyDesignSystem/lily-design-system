import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Slider from './Slider.vue';

const meta = {
  title: 'Headless/Slider',
  component: Slider,
  tags: ['autodocs']
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
