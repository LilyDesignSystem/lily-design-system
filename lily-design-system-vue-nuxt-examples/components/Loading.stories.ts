import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Loading from './Loading.vue';

const meta = {
  title: 'Headless/Loading',
  component: Loading,
  tags: ['autodocs']
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
