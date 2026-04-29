import Link from "next/link";

const examples = [
  {
    href: "/contact-form",
    title: "Contact Form",
    description:
      "Form, Field, TextInput, EmailInput, TextAreaInput, Select, ErrorSummary",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Card, Progress, ProgressCircle, Badge, Banner, DataTable",
  },
  {
    href: "/dialog-flow",
    title: "Dialog Flow",
    description: "Dialog, AlertDialog, Drawer, Popover, Tooltip",
  },
  {
    href: "/file-upload-form",
    title: "File Upload Form",
    description: "FileUpload, Progress, Badge, Form, Field",
  },
  {
    href: "/navigation-and-menus",
    title: "Navigation and Menus",
    description: "NavigationMenu, MenuBar, ToolBar, HamburgerMenu",
  },
  {
    href: "/page-layout",
    title: "Page Layout",
    description: "SkipLink, Header, Footer, BreadcrumbNav, Sidebar",
  },
  {
    href: "/rating-and-feedback",
    title: "Rating and Feedback",
    description:
      "FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker",
  },
  {
    href: "/search-and-filter",
    title: "Search and Filter",
    description: "Combobox, SearchInput, TagInput, DataTable",
  },
  {
    href: "/settings-page",
    title: "Settings Page",
    description: "SwitchButton, RadioGroup, Select, Fieldset",
  },
  {
    href: "/tabbed-interface",
    title: "Tabbed Interface",
    description: "TabBar, AccordionNav, Badge",
  },
  {
    href: "/task-management",
    title: "Task Management",
    description: "TaskList, TextInput, CheckboxInput, Badge, Progress",
  },
  {
    href: "/timeline-and-cards",
    title: "Timeline and Cards",
    description: "TimelineList, Card, DateRange, ReviewDate, SummaryList",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <h1>Lily Design System</h1>
      <p>React Next.js examples with NHS UK design system styles.</p>
      <h2>Examples</h2>
      <ul>
        {examples.map((ex) => (
          <li key={ex.href}>
            <Link href={ex.href}>
              <strong>{ex.title}</strong>
            </Link>
            <br />
            <span>{ex.description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
