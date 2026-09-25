import type { Meta, StoryObj } from '@storybook/react-vite';
import TurkiyeTcKimlikNumarasiView from './TurkiyeTcKimlikNumarasiView';

const meta = {
  title: 'Headless/TurkiyeTcKimlikNumarasiView',
  component: TurkiyeTcKimlikNumarasiView,
  tags: ['autodocs']
} satisfies Meta<typeof TurkiyeTcKimlikNumarasiView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'TurkiyeTcKimlikNumarasiView' }
};
