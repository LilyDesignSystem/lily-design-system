import type { Meta, StoryObj } from '@storybook/react-vite';
import DescriptionList from './DescriptionList';

const meta = {
  title: 'Headless/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs']
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
