import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementInstanceView from './MeasurementInstanceView';

const meta = {
  title: 'Examples/MeasurementInstanceView',
  component: MeasurementInstanceView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
