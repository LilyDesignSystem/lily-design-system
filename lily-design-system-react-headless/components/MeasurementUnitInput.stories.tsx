import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementUnitInput from './MeasurementUnitInput';

const meta = {
  title: 'Headless/MeasurementUnitInput',
  component: MeasurementUnitInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitInput>;

export default meta;
type Story = StoryObj<typeof MeasurementUnitInput>;

export const Default: Story = {};
