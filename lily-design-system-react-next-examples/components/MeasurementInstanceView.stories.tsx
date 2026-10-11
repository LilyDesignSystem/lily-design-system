import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementInstanceView from './MeasurementInstanceView';

const meta = {
  title: 'Headless/MeasurementInstanceView',
  component: MeasurementInstanceView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
