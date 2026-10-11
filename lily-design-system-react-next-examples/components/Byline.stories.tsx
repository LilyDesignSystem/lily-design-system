import type { Meta, StoryObj } from '@storybook/react-vite';
import Byline from './Byline';

const meta = {
  title: 'Headless/Byline',
  component: Byline,
  tags: ['autodocs']
} satisfies Meta<typeof Byline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
