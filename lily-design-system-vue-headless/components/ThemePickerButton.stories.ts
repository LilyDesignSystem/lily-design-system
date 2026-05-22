import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemePickerButton from './ThemePickerButton.vue';

const meta = {
  title: 'Headless/ThemePickerButton',
  component: ThemePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof ThemePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
