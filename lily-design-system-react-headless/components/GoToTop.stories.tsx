import type { Meta, StoryObj } from '@storybook/react-vite';
import GoToTop from './GoToTop';

const meta = {
  title: 'Headless/GoToTop',
  component: GoToTop,
  tags: ['autodocs']
} satisfies Meta<typeof GoToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
