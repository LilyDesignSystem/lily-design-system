import type { Meta, StoryObj } from '@storybook/react-vite';
import Splitter from './Splitter';

const meta = {
  title: 'Headless/Splitter',
  component: Splitter,
  tags: ['autodocs']
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
