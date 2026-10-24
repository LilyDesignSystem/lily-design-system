import { useState } from "react";
import { MarkdownEditor } from "../MarkdownEditor";

const labels = {
  heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
  link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
};

export default function Basic() {
  const [body, setBody] = useState("Hello **world**");
  return (
    <form>
      <MarkdownEditor value={body} onChange={setBody} label="Message" toolbarLabel="Formatting" labels={labels} name="body" rows={8} />
      <button type="submit">Send</button>
      <pre>{body}</pre>
    </form>
  );
}
