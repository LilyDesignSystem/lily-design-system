import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonGroup from './ButtonGroup.vue';

const meta = {
  title: 'Examples/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
