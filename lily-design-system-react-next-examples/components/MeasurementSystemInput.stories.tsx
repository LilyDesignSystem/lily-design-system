import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementSystemInput from './MeasurementSystemInput';

const meta = {
  title: 'Examples/MeasurementSystemInput',
  component: MeasurementSystemInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementSystemInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
