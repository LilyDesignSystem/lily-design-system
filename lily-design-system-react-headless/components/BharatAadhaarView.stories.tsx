import type { Meta, StoryObj } from '@storybook/react-vite';
import BharatAadhaarView from './BharatAadhaarView';

const meta = {
  title: 'Headless/BharatAadhaarView',
  component: BharatAadhaarView,
  tags: ['autodocs']
} satisfies Meta<typeof BharatAadhaarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BharatAadhaarView' }
};
