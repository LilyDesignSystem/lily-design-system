import type { Meta, StoryObj } from '@storybook/react-vite';
import WarningCallout from './WarningCallout';

const meta = {
  title: 'Headless/WarningCallout',
  component: WarningCallout,
  tags: ['autodocs']
} satisfies Meta<typeof WarningCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
