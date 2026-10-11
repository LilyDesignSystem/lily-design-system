import type { Meta, StoryObj } from '@storybook/react-vite';
import ContentsList from './ContentsList';

const meta = {
  title: 'Headless/ContentsList',
  component: ContentsList,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
