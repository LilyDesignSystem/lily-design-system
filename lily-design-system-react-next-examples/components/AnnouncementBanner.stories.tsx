import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AnnouncementBanner from './AnnouncementBanner';

const meta = {
  title: 'Examples/AnnouncementBanner',
  component: AnnouncementBanner,
  tags: ['autodocs']
} satisfies Meta<typeof AnnouncementBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
