import type { Meta, StoryObj } from '@storybook/react-vite';
import DontList from './DontList';

const meta = {
  title: 'Headless/DontList',
  component: DontList,
  tags: ['autodocs']
} satisfies Meta<typeof DontList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
