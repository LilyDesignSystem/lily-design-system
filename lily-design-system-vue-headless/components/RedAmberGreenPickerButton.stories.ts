import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.vue';

const meta = {
  title: 'Headless/RedAmberGreenPickerButton',
  component: RedAmberGreenPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
