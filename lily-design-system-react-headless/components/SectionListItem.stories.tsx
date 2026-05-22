import type { Meta, StoryObj } from '@storybook/react-vite';
import SectionListItem from './SectionListItem';

const meta = {
  title: 'Headless/SectionListItem',
  component: SectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof SectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
