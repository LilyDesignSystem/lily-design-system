import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Field from './Field.vue';

const meta = {
  title: 'Headless/Field',
  component: Field,
  tags: ['autodocs']
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
