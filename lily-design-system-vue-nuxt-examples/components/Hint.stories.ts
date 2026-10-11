import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Hint from './Hint.vue';

const meta = {
  title: 'Headless/Hint',
  component: Hint,
  tags: ['autodocs']
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
