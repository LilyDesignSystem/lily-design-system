import { createSignal } from "solid-js";
import SettingsPicker from "../SettingsPicker";

// The content receives `close`. Typing in the input does not close the panel (it is not a link or
// button); submitting calls close() itself.
export default function Form() {
    const [query, setQuery] = createSignal("");
    return (
        <SettingsPicker label="Settings">
            {({ close }) => (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        close();
                    }}
                >
                    <input
                        type="search"
                        aria-label="Search"
                        value={query()}
                        onInput={(e) => setQuery(e.currentTarget.value)}
                    />
                    <button
                        type="submit"
                        data-settings-picker-keep-open
                    >
                        Go
                    </button>
                </form>
            )}
        </SettingsPicker>
    );
}
