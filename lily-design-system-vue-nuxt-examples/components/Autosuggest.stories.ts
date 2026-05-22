import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Autosuggest from './Autosuggest.vue';

const meta = {
  title: 'Examples/Autosuggest',
  component: Autosuggest,
  tags: ['autodocs']
} satisfies Meta<typeof Autosuggest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
