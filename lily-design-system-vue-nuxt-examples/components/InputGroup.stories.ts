import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputGroup from './InputGroup.vue';

const meta = {
  title: 'Headless/InputGroup',
  component: InputGroup,
  tags: ['autodocs']
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
