import type { Meta, StoryObj } from '@storybook/react-vite';
import BharatAadhaarInput from './BharatAadhaarInput';

const meta = {
  title: 'Headless/BharatAadhaarInput',
  component: BharatAadhaarInput,
  tags: ['autodocs']
} satisfies Meta<typeof BharatAadhaarInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BharatAadhaarInput' }
};
