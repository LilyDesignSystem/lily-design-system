import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SplitButton from './SplitButton.vue';

const meta = {
  title: 'Headless/SplitButton',
  component: SplitButton,
  tags: ['autodocs']
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
