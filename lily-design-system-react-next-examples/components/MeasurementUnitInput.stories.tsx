import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementUnitInput from './MeasurementUnitInput';

const meta = {
  title: 'Examples/MeasurementUnitInput',
  component: MeasurementUnitInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
