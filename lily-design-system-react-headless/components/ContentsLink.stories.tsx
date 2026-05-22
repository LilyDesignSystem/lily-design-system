import type { Meta, StoryObj } from '@storybook/react-vite';
import ContentsLink from './ContentsLink';

const meta = {
  title: 'Headless/ContentsLink',
  component: ContentsLink,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
