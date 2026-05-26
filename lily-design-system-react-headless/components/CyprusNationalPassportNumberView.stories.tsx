import type { Meta, StoryObj } from '@storybook/react-vite';
import CyprusNationalPassportNumberView from './CyprusNationalPassportNumberView';

const meta = {
  title: 'Headless/CyprusNationalPassportNumberView',
  component: CyprusNationalPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof CyprusNationalPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CyprusNationalPassportNumberView' }
};
