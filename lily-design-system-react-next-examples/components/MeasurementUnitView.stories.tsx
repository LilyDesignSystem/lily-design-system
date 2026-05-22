import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementUnitView from './MeasurementUnitView';

const meta = {
  title: 'Examples/MeasurementUnitView',
  component: MeasurementUnitView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
