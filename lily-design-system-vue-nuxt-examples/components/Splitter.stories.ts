import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Splitter from './Splitter.vue';

const meta = {
  title: 'Headless/Splitter',
  component: Splitter,
  tags: ['autodocs']
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
