import type { Meta, StoryObj } from '@storybook/react-vite';
import HangukJuminDeungnokBeonhoView from './HangukJuminDeungnokBeonhoView';

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoView',
  component: HangukJuminDeungnokBeonhoView,
  tags: ['autodocs']
} satisfies Meta<typeof HangukJuminDeungnokBeonhoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HangukJuminDeungnokBeonhoView' }
};
