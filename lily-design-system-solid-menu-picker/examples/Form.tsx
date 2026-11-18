import { createSignal } from "solid-js";
import MenuPicker from "../MenuPicker";

// The content receives `close`. Typing in the input does not close the panel (it is not a link or
// button); submitting calls close() itself.
export default function Form() {
    const [query, setQuery] = createSignal("");
    return (
        <MenuPicker label="Menu">
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
                        defaultValue={query()}
                        onInput={(e) => setQuery(e.currentTarget.value)}
                    />
                    <button
                        type="submit"
                        data-menu-picker-keep-open
                    >
                        Go
                    </button>
                </form>
            )}
        </MenuPicker>
    );
}
