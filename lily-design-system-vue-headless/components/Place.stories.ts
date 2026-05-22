import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Place from './Place.vue';

const meta = {
  title: 'Headless/Place',
  component: Place,
  tags: ['autodocs']
} satisfies Meta<typeof Place>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
