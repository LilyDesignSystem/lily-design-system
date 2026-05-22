import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form
  class="newsletter-signup"
  data-state="idle"  method="post">  <label class="newsletter-signup-label" for="newsletter-signup-email"></label>
  <input
    class="newsletter-signup-input"
    type="email"
    id="newsletter-signup-email"
    name="email"  >
  <button
    class="newsletter-signup-submit"
    type="submit"  ></button>
  <p
    class="newsletter-signup-success"
    role="status"
    aria-live="polite" hidden  ></p>
  <p
    class="newsletter-signup-error"
    role="alert" hidden  ></p>
</form>`;

const meta = {
  title: 'Headless/NewsletterSignup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
