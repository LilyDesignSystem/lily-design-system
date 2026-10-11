import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BulgariaEdinenGrazhdanskiNomerView from './BulgariaEdinenGrazhdanskiNomerView.vue';

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
