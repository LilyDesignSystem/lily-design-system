// Lily Design System for Android (spec/android-kotlin, tasks.md Phase 45).
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "lily-design-system-kotlin"
include(":lily-core", ":lily-compose", ":lily-compose-examples", ":lily-compose-themes")
