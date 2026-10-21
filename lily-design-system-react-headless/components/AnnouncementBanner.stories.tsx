import type { Meta, StoryObj } from '@storybook/react-vite';
import AnnouncementBanner from './AnnouncementBanner';

const meta = {
  title: 'Headless/AnnouncementBanner',
  component: AnnouncementBanner,
  tags: ['autodocs']
} satisfies Meta<typeof AnnouncementBanner>;

export default meta;
type Story = StoryObj<typeof AnnouncementBanner>;

export const Default: Story = {};
