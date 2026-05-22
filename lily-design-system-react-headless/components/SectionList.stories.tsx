import type { Meta, StoryObj } from '@storybook/react-vite';
import SectionList from './SectionList';

const meta = {
  title: 'Headless/SectionList',
  component: SectionList,
  tags: ['autodocs']
} satisfies Meta<typeof SectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
