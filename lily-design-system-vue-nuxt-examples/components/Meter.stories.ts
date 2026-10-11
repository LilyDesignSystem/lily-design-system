import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Meter from './Meter.vue';

const meta = {
  title: 'Headless/Meter',
  component: Meter,
  tags: ['autodocs']
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
