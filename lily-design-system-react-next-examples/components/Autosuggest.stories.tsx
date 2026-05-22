import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Autosuggest from './Autosuggest';

const meta = {
  title: 'Examples/Autosuggest',
  component: Autosuggest,
  tags: ['autodocs']
} satisfies Meta<typeof Autosuggest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
