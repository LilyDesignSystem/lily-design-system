import type { Meta, StoryObj } from '@storybook/react-vite';
import NederlandPaspoortNummerView from './NederlandPaspoortNummerView';

const meta = {
  title: 'Headless/NederlandPaspoortNummerView',
  component: NederlandPaspoortNummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandPaspoortNummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandPaspoortNummerView' }
};
