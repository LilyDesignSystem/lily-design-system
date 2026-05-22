import type { Meta, StoryObj } from '@storybook/react-vite';
import StickyPromoBanner from './StickyPromoBanner';

const meta = {
  title: 'Headless/StickyPromoBanner',
  component: StickyPromoBanner,
  tags: ['autodocs']
} satisfies Meta<typeof StickyPromoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
