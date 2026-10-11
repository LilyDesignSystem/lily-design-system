import type { Meta, StoryObj } from '@storybook/react-vite';
import RedAmberGreenPickerButton from './RedAmberGreenPickerButton';

const meta = {
  title: 'Headless/RedAmberGreenPickerButton',
  component: RedAmberGreenPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
