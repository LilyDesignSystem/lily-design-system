import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Caption from './Caption.vue';

const meta = {
  title: 'Headless/Caption',
  component: Caption,
  tags: ['autodocs']
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
