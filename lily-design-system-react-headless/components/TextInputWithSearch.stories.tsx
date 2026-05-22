import type { Meta, StoryObj } from '@storybook/react-vite';
import TextInputWithSearch from './TextInputWithSearch';

const meta = {
  title: 'Headless/TextInputWithSearch',
  component: TextInputWithSearch,
  tags: ['autodocs']
} satisfies Meta<typeof TextInputWithSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
