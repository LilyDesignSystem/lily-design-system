import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MenuBar from './MenuBar.vue';

const meta = {
  title: 'Headless/MenuBar',
  component: MenuBar,
  tags: ['autodocs']
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
