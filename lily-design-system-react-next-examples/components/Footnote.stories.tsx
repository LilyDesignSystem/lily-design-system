import type { Meta, StoryObj } from '@storybook/react-vite';
import Footnote from './Footnote';

const meta = {
  title: 'Headless/Footnote',
  component: Footnote,
  tags: ['autodocs']
} satisfies Meta<typeof Footnote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
