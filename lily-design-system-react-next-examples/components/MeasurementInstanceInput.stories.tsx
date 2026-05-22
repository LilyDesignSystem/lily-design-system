import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MeasurementInstanceInput from './MeasurementInstanceInput';

const meta = {
  title: 'Examples/MeasurementInstanceInput',
  component: MeasurementInstanceInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
