import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Byline from './Byline.vue';

const meta = {
  title: 'Headless/Byline',
  component: Byline,
  tags: ['autodocs']
} satisfies Meta<typeof Byline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
