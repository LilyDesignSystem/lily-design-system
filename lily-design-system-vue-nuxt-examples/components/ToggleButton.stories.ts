import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToggleButton from './ToggleButton.vue';

const meta = {
  title: 'Examples/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs']
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
