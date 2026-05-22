import type { Meta, StoryObj } from '@storybook/react-vite';
import Autosuggest from './Autosuggest';

const meta = {
  title: 'Headless/Autosuggest',
  component: Autosuggest,
  tags: ['autodocs']
} satisfies Meta<typeof Autosuggest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
