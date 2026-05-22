import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UrlInput from './UrlInput';

const meta = {
  title: 'Examples/UrlInput',
  component: UrlInput,
  tags: ['autodocs']
} satisfies Meta<typeof UrlInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
