import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContentsLink from './ContentsLink.vue';

const meta = {
  title: 'Headless/ContentsLink',
  component: ContentsLink,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
