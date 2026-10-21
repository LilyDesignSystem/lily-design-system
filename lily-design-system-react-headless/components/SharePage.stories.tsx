import type { Meta, StoryObj } from '@storybook/react-vite';
import SharePage from './SharePage';

const meta = {
  title: 'Headless/SharePage',
  component: SharePage,
  tags: ['autodocs']
} satisfies Meta<typeof SharePage>;

export default meta;
type Story = StoryObj<typeof SharePage>;

export const Default: Story = {};
