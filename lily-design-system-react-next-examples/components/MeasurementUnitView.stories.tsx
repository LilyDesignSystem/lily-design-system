import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementUnitView from './MeasurementUnitView';

const meta = {
  title: 'Headless/MeasurementUnitView',
  component: MeasurementUnitView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
