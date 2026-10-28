<script setup lang="ts">
import { ref } from "vue";

const confirmOpen = ref(false);
const alertOpen = ref(false);
const drawerOpen = ref(false);
const deleted = ref(false);

function handleDelete() {
    deleted.value = true;
    confirmOpen.value = false;
}
</script>

<template>
    <main class="page-wrapper">
        <h1>Dialog Examples</h1>

        <section class="section">
            <Tooltip label="Opens a confirmation dialog">
                <Button
                    @click="confirmOpen = true"
                    :disabled="deleted"
                >
                    Delete Account
                </Button>
            </Tooltip>

            <Dialog
                v-if="confirmOpen"
                :open="confirmOpen"
                label="Confirm account deletion"
            >
                <h3>Delete your account?</h3>
                <p>This action cannot be undone. All your data will be permanently removed.</p>
                <div>
                    <Button @click="confirmOpen = false">Cancel</Button>
                    <Button @click="handleDelete">Delete permanently</Button>
                </div>
            </Dialog>
        </section>

        <section class="section">
            <Button @click="alertOpen = true"> Show Session Warning </Button>

            <AlertDialog
                v-if="alertOpen"
                :open="alertOpen"
                label="Session expiring"
            >
                <p>
                    Your session will expire in 5 minutes. Save your work to avoid losing changes.
                </p>
                <Button @click="alertOpen = false"> Dismiss </Button>
            </AlertDialog>
        </section>

        <section class="section">
            <Button @click="drawerOpen = true"> Open Help Panel </Button>

            <Drawer
                v-if="drawerOpen"
                :open="drawerOpen"
                label="Help panel"
                side="right"
            >
                <h3>Need help?</h3>
                <ul>
                    <li><a href="/docs/getting-started">Getting Started</a></li>
                    <li><a href="/docs/faq">FAQ</a></li>
                    <li><a href="/docs/api">API Reference</a></li>
                </ul>
                <Button @click="drawerOpen = false">Close</Button>
            </Drawer>
        </section>

        <p
            v-if="deleted"
            role="status"
        >
            Account has been deleted.
        </p>
    </main>
</template>
