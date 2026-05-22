import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PostalCodeView from './PostalCodeView.vue';

const meta = {
  title: 'Examples/PostalCodeView',
  component: PostalCodeView,
  tags: ['autodocs']
} satisfies Meta<typeof PostalCodeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
