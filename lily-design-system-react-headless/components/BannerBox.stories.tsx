import type { Meta, StoryObj } from '@storybook/react-vite';
import BannerBox from './BannerBox';

const meta = {
  title: 'Headless/BannerBox',
  component: BannerBox,
  tags: ['autodocs']
} satisfies Meta<typeof BannerBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
