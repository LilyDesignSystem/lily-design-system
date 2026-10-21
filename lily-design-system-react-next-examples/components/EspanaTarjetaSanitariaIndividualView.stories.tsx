import type { Meta, StoryObj } from '@storybook/react-vite';
import EspanaTarjetaSanitariaIndividualView from './EspanaTarjetaSanitariaIndividualView';

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualView',
  component: EspanaTarjetaSanitariaIndividualView,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaTarjetaSanitariaIndividualView>;

export default meta;
type Story = StoryObj<typeof EspanaTarjetaSanitariaIndividualView>;

export const Default: Story = {};
