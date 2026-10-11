import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Editable from './Editable.vue';

const meta = {
  title: 'Headless/Editable',
  component: Editable,
  tags: ['autodocs']
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
