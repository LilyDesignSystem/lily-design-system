import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Figure from './Figure.vue';

const meta = {
  title: 'Headless/Figure',
  component: Figure,
  tags: ['autodocs']
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
