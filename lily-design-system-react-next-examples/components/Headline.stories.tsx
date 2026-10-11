import type { Meta, StoryObj } from '@storybook/react-vite';
import Headline from './Headline';

const meta = {
  title: 'Headless/Headline',
  component: Headline,
  tags: ['autodocs']
} satisfies Meta<typeof Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
