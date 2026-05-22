import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextInputWithSearch from './TextInputWithSearch';

const meta = {
  title: 'Examples/TextInputWithSearch',
  component: TextInputWithSearch,
  tags: ['autodocs']
} satisfies Meta<typeof TextInputWithSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
