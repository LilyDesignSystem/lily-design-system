import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Flair from './Flair.vue';

const meta = {
  title: 'Headless/Flair',
  component: Flair,
  tags: ['autodocs']
} satisfies Meta<typeof Flair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
