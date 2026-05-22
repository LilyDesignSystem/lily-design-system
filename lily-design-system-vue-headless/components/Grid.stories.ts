import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Grid from './Grid.vue';

const meta = {
  title: 'Headless/Grid',
  component: Grid,
  tags: ['autodocs']
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
