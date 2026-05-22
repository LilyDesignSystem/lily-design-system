import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SharePage from './SharePage';

const meta = {
  title: 'Examples/SharePage',
  component: SharePage,
  tags: ['autodocs']
} satisfies Meta<typeof SharePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
