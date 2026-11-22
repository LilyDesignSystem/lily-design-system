plugins {
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.multiplatform) apply false
    alias(libs.plugins.kotlin.compose) apply false
}

// lily-compose is unstyled: it may depend on compose.foundation and compose.ui, never on a Material library
// (spec/android-kotlin, acceptance criteria). This task fails the build if one appears.
val checkNoMaterial by tasks.registering {
    description = "Fails if lily-compose depends on any Material artifact."
    val graph = project(":lily-compose").configurations.named("releaseRuntimeClasspath")
    doLast {
        val material = graph.get().incoming.resolutionResult.allComponents
            .map { it.moduleVersion?.module?.toString().orEmpty() }
            .filter { "material" in it }
        check(material.isEmpty()) { "lily-compose must not depend on Material: $material" }
    }
}
