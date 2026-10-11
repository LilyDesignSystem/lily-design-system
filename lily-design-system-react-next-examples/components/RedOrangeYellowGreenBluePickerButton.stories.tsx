import type { Meta, StoryObj } from '@storybook/react-vite';
import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton';

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePickerButton',
  component: RedOrangeYellowGreenBluePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof RedOrangeYellowGreenBluePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
