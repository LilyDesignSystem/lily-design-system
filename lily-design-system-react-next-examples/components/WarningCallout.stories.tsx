import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WarningCallout from './WarningCallout';

const meta = {
  title: 'Examples/WarningCallout',
  component: WarningCallout,
  tags: ['autodocs']
} satisfies Meta<typeof WarningCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
