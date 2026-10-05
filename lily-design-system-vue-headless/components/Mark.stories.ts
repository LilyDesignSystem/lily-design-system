import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Mark from './Mark.vue';

const meta = {
  title: 'Headless/Mark',
  component: Mark,
  tags: ['autodocs']
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
