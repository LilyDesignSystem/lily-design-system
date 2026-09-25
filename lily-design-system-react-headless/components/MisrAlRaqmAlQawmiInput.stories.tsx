import type { Meta, StoryObj } from '@storybook/react-vite';
import MisrAlRaqmAlQawmiInput from './MisrAlRaqmAlQawmiInput';

const meta = {
  title: 'Headless/MisrAlRaqmAlQawmiInput',
  component: MisrAlRaqmAlQawmiInput,
  tags: ['autodocs']
} satisfies Meta<typeof MisrAlRaqmAlQawmiInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MisrAlRaqmAlQawmiInput' }
};
