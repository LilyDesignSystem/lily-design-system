import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BulgariaEdinenGrazhdanskiNomerView from './BulgariaEdinenGrazhdanskiNomerView';

const meta = {
  title: 'Examples/BulgariaEdinenGrazhdanskiNomerView',
  component: BulgariaEdinenGrazhdanskiNomerView,
  tags: ['autodocs']
} satisfies Meta<typeof BulgariaEdinenGrazhdanskiNomerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BulgariaEdinenGrazhdanskiNomerView' }
};
