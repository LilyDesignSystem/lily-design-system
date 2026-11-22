// Compose components on compose.foundation and compose.ui only (spec/android-kotlin).
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "io.github.lilydesignsystem.compose"
    compileSdk { version = release(37) { minorApiLevel = 2 } }
    defaultConfig { minSdk = 23 }
    testOptions { unitTests { isIncludeAndroidResources = true } }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    explicitApi()
    compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }
}

dependencies {
    api(project(":lily-core"))
    implementation(platform(libs.compose.bom))
    api(libs.compose.foundation)
    api(libs.compose.ui)
    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.compose.ui.test.junit4)
    testImplementation(libs.junit)
    testImplementation(libs.robolectric)
    testImplementation(libs.androidx.test.core)
    debugImplementation(platform(libs.compose.bom))
    debugImplementation(libs.compose.ui.test.manifest)
}
