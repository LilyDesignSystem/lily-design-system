// Generated theme tokens (bin/generate-mobile-tokens) as Compose colours and dp; no Material dependency.
plugins {
    alias(libs.plugins.kover)
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "io.github.lilydesignsystem.compose.themes"
    compileSdk { version = release(37) { minorApiLevel = 2 } }
    defaultConfig { minSdk = 24 }
    testOptions { unitTests { isIncludeAndroidResources = true } }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    explicitApi()
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) }
}

dependencies {
    api(project(":lily-compose"))
    implementation(platform(libs.compose.bom))
    api(libs.compose.ui)
    implementation(libs.compose.foundation)
    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.compose.ui.test.junit4)
    testImplementation(libs.junit)
    testImplementation(libs.robolectric)
    testImplementation(libs.androidx.test.core)
    debugImplementation(platform(libs.compose.bom))
    debugImplementation(libs.compose.ui.test.manifest)
}
