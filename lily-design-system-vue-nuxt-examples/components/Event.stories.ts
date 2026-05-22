import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Event from './Event.vue';

const meta = {
  title: 'Examples/Event',
  component: Event,
  tags: ['autodocs']
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
