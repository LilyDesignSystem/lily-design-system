import type { Meta, StoryObj } from '@storybook/react-vite';
import DownloadButton from './DownloadButton';

const meta = {
  title: 'Headless/DownloadButton',
  component: DownloadButton,
  tags: ['autodocs']
} satisfies Meta<typeof DownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
