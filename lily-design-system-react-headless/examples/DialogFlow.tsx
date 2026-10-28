// Example: Dialog flows with confirmation, alerts, and drawers
//
// Demonstrates: Dialog, AlertDialog, Drawer, Button, Popover, Tooltip

import { useState } from "react";
import Dialog from "../components/Dialog";
import AlertDialog from "../components/AlertDialog";
import Drawer from "../components/Drawer";
import Button from "../components/Button";
import Popover from "../components/Popover";
import Tooltip from "../components/Tooltip";

export default function DialogFlow() {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);

    function handleDelete() {
        setDeleted(true);
        setConfirmOpen(false);
    }

    return (
        <div>
            <h2>Dialog Examples</h2>

            {/* Confirmation dialog */}
            <div>
                <Tooltip label="Opens a confirmation dialog">
                    <Button
                        onClick={() => setConfirmOpen(true)}
                        disabled={deleted}
                    >
                        Delete Account
                    </Button>
                </Tooltip>

                <Dialog
                    open={confirmOpen}
                    label="Confirm account deletion"
                    onChange={setConfirmOpen}
                >
                    <h3>Delete your account?</h3>
                    <p>This action cannot be undone. All your data will be permanently removed.</p>
                    <div>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete}>Delete permanently</Button>
                    </div>
                </Dialog>
            </div>

            {/* Alert dialog for critical information */}
            <div>
                <Button onClick={() => setAlertOpen(true)}>Show Session Warning</Button>

                <AlertDialog
                    open={alertOpen}
                    label="Session expiring"
                >
                    <p>
                        Your session will expire in 5 minutes. Save your work to avoid losing
                        changes.
                    </p>
                    <Button onClick={() => setAlertOpen(false)}>Dismiss</Button>
                </AlertDialog>
            </div>

            {/* Drawer for side panel content */}
            <div>
                <Button onClick={() => setDrawerOpen(true)}>Open Help Panel</Button>

                <Drawer
                    open={drawerOpen}
                    label="Help panel"
                    side="right"
                    onChange={setDrawerOpen}
                >
                    <h3>Need help?</h3>
                    <ul>
                        <li>
                            <a href="/docs/getting-started">Getting Started</a>
                        </li>
                        <li>
                            <a href="/docs/faq">FAQ</a>
                        </li>
                        <li>
                            <a href="/docs/api">API Reference</a>
                        </li>
                    </ul>
                    <Button onClick={() => setDrawerOpen(false)}>Close</Button>
                </Drawer>
            </div>

            {deleted && <p role="status">Account has been deleted.</p>}
        </div>
    );
}
