import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ChatComposer component -->\n<!--\n  Description: a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress.\n  HTML tag: <form> containing <textarea class=\"chat-composer-input\"> and one <button class=\"chat-composer-button\">\n  CSS class: chat-composer\n  Keyboard: Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored\n  Accessibility: the textarea is named by aria-label; the one button is send (type=submit,\n    data-state=send) or, while a reply is in progress, stop (type=button, data-state=stop); the\n    send button is disabled, never hidden, when the text is empty.\n  MARKUP-ONLY DEVIATION: this HTML catalog's macros ship no JavaScript, so the behaviours that need script — Enter to send (Shift+Enter for a line break, ignoring Enter during IME composition), growing the textarea as the user types, and swapping send/stop on the fly — are not in the macro. The macro renders the correct initial markup from its params (rows from the value's line count, send or stop from `busy`, the send button disabled when the value is empty); add a small client script (or use the Web Components catalog's element) for the live behaviour.\n-->\n\n<form class=\"chat-composer\">\n  <textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"1\"></textarea>\n  <button class=\"chat-composer-button\" type=\"submit\" data-state=\"send\" disabled><span class=\"chat-composer-button-label\">Send</span></button>\n</form>\n<form class=\"chat-composer\" id=\"chat-composer-busy\">\n  <textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"2\">Explain headless components</textarea>\n  <button class=\"chat-composer-button\" type=\"button\" data-state=\"stop\"><span class=\"chat-composer-button-label\">Stop</span></button>\n</form>";

const meta = {
  title: 'Headless/Chat Composer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
