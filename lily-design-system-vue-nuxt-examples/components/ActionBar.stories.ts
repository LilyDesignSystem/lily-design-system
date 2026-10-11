import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ActionBar from './ActionBar.vue';

const meta = {
  title: 'Headless/ActionBar',
  component: ActionBar,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
