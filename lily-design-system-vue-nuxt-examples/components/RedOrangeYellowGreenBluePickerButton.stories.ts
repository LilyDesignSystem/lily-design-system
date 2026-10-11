import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.vue';

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePickerButton',
  component: RedOrangeYellowGreenBluePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof RedOrangeYellowGreenBluePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
