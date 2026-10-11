import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementSystemView from './MeasurementSystemView';

const meta = {
  title: 'Headless/MeasurementSystemView',
  component: MeasurementSystemView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementSystemView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
