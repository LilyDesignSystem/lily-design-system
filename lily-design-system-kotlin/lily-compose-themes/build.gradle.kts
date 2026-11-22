// Generated theme tokens (bin/generate-mobile-tokens) as Compose colours and dp; no Material dependency.
plugins {
    alias(libs.plugins.kover)
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "io.github.lilydesignsystem.compose.themes"
    compileSdk { version = release(37) { minorApiLevel = 2 } }
    defaultConfig { minSdk = 23 }
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
    implementation(platform(libs.compose.bom))
    api(libs.compose.ui)
    testImplementation(libs.junit)
}
