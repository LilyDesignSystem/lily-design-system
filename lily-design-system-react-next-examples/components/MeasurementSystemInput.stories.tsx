import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementSystemInput from './MeasurementSystemInput';

const meta = {
  title: 'Headless/MeasurementSystemInput',
  component: MeasurementSystemInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementSystemInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
