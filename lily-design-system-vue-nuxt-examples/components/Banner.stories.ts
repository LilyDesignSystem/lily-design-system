import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Banner from './Banner.vue';

const meta = {
  title: 'Headless/Banner',
  component: Banner,
  tags: ['autodocs']
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
