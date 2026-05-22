import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Label from './Label.vue';

const meta = {
  title: 'Headless/Label',
  component: Label,
  tags: ['autodocs']
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
