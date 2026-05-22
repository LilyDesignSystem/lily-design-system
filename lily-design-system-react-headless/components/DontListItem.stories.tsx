import type { Meta, StoryObj } from '@storybook/react-vite';
import DontListItem from './DontListItem';

const meta = {
  title: 'Headless/DontListItem',
  component: DontListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DontListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
