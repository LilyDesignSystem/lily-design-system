import type { Meta, StoryObj } from '@storybook/react-vite';
import UrlInput from './UrlInput';

const meta = {
  title: 'Headless/UrlInput',
  component: UrlInput,
  tags: ['autodocs']
} satisfies Meta<typeof UrlInput>;

export default meta;
type Story = StoryObj<typeof UrlInput>;

export const Default: Story = {};
