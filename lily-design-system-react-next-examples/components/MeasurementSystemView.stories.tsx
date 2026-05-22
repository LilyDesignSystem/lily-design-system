import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementSystemView from './MeasurementSystemView';

const meta = {
  title: 'Examples/MeasurementSystemView',
  component: MeasurementSystemView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementSystemView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
