import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GoToTop from './GoToTop.vue';

const meta = {
  title: 'Headless/GoToTop',
  component: GoToTop,
  tags: ['autodocs']
} satisfies Meta<typeof GoToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
