// Pure Kotlin, no Android dependency (spec/android-kotlin): the ported shared modules. Multiplatform so Compose Multiplatform,
// server and desktop Kotlin can use it; the JVM target serves Android. Native targets are added when the toolchain is in CI.
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kover)
    alias(libs.plugins.kotlin.multiplatform)
}

kotlin {
    explicitApi()
    jvm { compilerOptions { jvmTarget.set(JvmTarget.JVM_17) } }
    sourceSets {
        commonTest.dependencies { implementation(kotlin("test")) }
        jvmTest.dependencies { implementation(libs.kotlinx.serialization.json) }
    }
}
