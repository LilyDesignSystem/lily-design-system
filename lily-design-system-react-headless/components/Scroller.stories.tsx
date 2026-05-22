import type { Meta, StoryObj } from '@storybook/react-vite';
import Scroller from './Scroller';

const meta = {
  title: 'Headless/Scroller',
  component: Scroller,
  tags: ['autodocs']
} satisfies Meta<typeof Scroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
