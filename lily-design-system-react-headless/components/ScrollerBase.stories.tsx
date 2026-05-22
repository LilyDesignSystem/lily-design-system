import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollerBase from './ScrollerBase';

const meta = {
  title: 'Headless/ScrollerBase',
  component: ScrollerBase,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollerBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
