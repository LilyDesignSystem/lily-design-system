import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Footer from './Footer.vue';

const meta = {
  title: 'Headless/Footer',
  component: Footer,
  tags: ['autodocs']
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
