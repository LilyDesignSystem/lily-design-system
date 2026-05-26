import type { Meta, StoryObj } from '@storybook/react-vite';
import BulgariaEdinenGrazhdanskiNomerInput from './BulgariaEdinenGrazhdanskiNomerInput';

const meta = {
  title: 'Headless/BulgariaEdinenGrazhdanskiNomerInput',
  component: BulgariaEdinenGrazhdanskiNomerInput,
  tags: ['autodocs']
} satisfies Meta<typeof BulgariaEdinenGrazhdanskiNomerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BulgariaEdinenGrazhdanskiNomerInput' }
};
