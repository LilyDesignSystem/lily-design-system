import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StickyPromoBanner from './StickyPromoBanner';

const meta = {
  title: 'Examples/StickyPromoBanner',
  component: StickyPromoBanner,
  tags: ['autodocs']
} satisfies Meta<typeof StickyPromoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
