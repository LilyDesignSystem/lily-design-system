import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Details from './Details.vue';

const meta = {
  title: 'Headless/Details',
  component: Details,
  tags: ['autodocs']
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
