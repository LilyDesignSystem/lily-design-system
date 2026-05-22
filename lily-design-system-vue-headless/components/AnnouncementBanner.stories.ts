import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AnnouncementBanner from './AnnouncementBanner.vue';

const meta = {
  title: 'Headless/AnnouncementBanner',
  component: AnnouncementBanner,
  tags: ['autodocs']
} satisfies Meta<typeof AnnouncementBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
