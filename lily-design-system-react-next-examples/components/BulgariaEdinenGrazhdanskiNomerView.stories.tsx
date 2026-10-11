import type { Meta, StoryObj } from '@storybook/react-vite';
import BulgariaEdinenGrazhdanskiNomerView from './BulgariaEdinenGrazhdanskiNomerView';

const meta = {
  title: 'Headless/BulgariaEdinenGrazhdanskiNomerView',
  component: BulgariaEdinenGrazhdanskiNomerView,
  tags: ['autodocs']
} satisfies Meta<typeof BulgariaEdinenGrazhdanskiNomerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BulgariaEdinenGrazhdanskiNomerView' }
};
