<script setup lang="ts">
</script>

<template>
    <div>

        <Header label="Site header">
            <h1>My Application</h1>
            <NavigationMenu label="Main navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </NavigationMenu>
        </Header>

        <BreadcrumbNav label="Breadcrumb">
            <BreadcrumbList>
                <BreadcrumbListItem>
                    <a href="/">Home</a>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <a href="/products">Products</a>
                </BreadcrumbListItem>
                <BreadcrumbListItem current>
                    Widget Pro
                </BreadcrumbListItem>
            </BreadcrumbList>
        </BreadcrumbNav>

        <div class="layout-body">
            <Sidebar label="Side navigation">
                <nav>
                    <ul>
                        <li><a href="#overview">Overview</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#reviews">Reviews</a></li>
                    </ul>
                </nav>
            </Sidebar>

            <main id="main-content">
                <h2>Widget Pro</h2>
                <p>The ultimate widget for all your needs.</p>
            </main>
        </div>

        <Footer label="Site footer">
            <p>&copy; 2026 My Application. All rights reserved.</p>
            <nav aria-label="Footer links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
            </nav>
        </Footer>
    </div>
</template>
