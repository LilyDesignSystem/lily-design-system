import type { Meta, StoryObj } from '@storybook/react-vite';
import MeasurementInstanceInput from './MeasurementInstanceInput';

const meta = {
  title: 'Headless/MeasurementInstanceInput',
  component: MeasurementInstanceInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
