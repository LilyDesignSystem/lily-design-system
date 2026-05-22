import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Framer from './Framer.vue';

const meta = {
  title: 'Examples/Framer',
  component: Framer,
  tags: ['autodocs']
} satisfies Meta<typeof Framer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
