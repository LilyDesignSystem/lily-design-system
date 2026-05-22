import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DownloadButton from './DownloadButton.vue';

const meta = {
  title: 'Headless/DownloadButton',
  component: DownloadButton,
  tags: ['autodocs']
} satisfies Meta<typeof DownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
