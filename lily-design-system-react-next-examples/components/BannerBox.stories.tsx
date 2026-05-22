import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BannerBox from './BannerBox';

const meta = {
  title: 'Examples/BannerBox',
  component: BannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof BannerBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
