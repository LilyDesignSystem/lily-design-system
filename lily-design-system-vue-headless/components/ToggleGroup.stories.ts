import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToggleGroup from './ToggleGroup.vue';

const meta = {
  title: 'Headless/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
