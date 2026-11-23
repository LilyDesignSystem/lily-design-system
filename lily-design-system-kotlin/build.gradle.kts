plugins {
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.multiplatform) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.kover)
}

// Test coverage of both modules (./gradlew koverLog, koverHtmlReport); koverVerify fails below the bound.
dependencies {
    kover(project(":lily-core"))
    kover(project(":lily-compose"))
    kover(project(":lily-compose-examples"))
    kover(project(":lily-compose-themes"))
}

kover {
    reports {
        verify { rule { minBound(100) } }
    }
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

// Publishing (spec/android-kotlin, tasks.md P45-T6). `bin/publish-kotlin` drives it. The modules that carry the library are
// published; the example app is not. `publishAllPublicationsToLocalRepository` writes a Maven layout under build/repo (a dry
// run: no credentials); `publishAllPublicationsToCentralRepository` uploads to the Central Portal's staging API and needs
// CENTRAL_USERNAME and CENTRAL_PASSWORD (a Portal user token) and, to sign, SIGNING_KEY (an armoured private key) and SIGNING_PASSWORD.
val publishable = setOf("lily-core", "lily-compose", "lily-compose-themes", "lily-compose-examples")
group = "io.github.lilydesignsystem"
version = providers.gradleProperty("lilyVersion").get()

subprojects {
    if (name !in publishable) return@subprojects
    group = rootProject.group
    version = rootProject.version
    apply(plugin = "maven-publish")
    apply(plugin = "signing")

    // Central requires a javadoc jar; the libraries' documentation is their spec, so it is an empty one.
    val javadocJar = tasks.register<Jar>("javadocJar") { archiveClassifier.set("javadoc") }

    pluginManager.withPlugin("com.android.library") {
        extensions.configure<com.android.build.api.dsl.LibraryExtension>("android") {
            publishing { singleVariant("release") { withSourcesJar() } }
        }
        afterEvaluate {
            extensions.configure<PublishingExtension> {
                publications { register<MavenPublication>("release") { from(components["release"]); artifactId = project.name } }
            }
        }
    }

    extensions.configure<PublishingExtension> {
        repositories {
            maven {
                name = "local"
                url = uri(rootProject.layout.buildDirectory.dir("repo"))
            }
            maven {
                name = "central"
                url = uri("https://ossrh-staging-api.central.sonatype.com/service/local/staging/deploy/maven2/")
                credentials {
                    username = providers.environmentVariable("CENTRAL_USERNAME").orNull
                    password = providers.environmentVariable("CENTRAL_PASSWORD").orNull
                }
            }
        }
        publications.withType<MavenPublication>().configureEach {
            artifact(javadocJar)
            pom {
                name.set(project.name)
                description.set("Lily Design System for Android: ${project.name}. Accessible Jetpack Compose components that take every word from the app.")
                url.set("https://github.com/LilyDesignSystem/lily-design-system/tree/main/lily-design-system-kotlin")
                licenses {
                    // Offered under any one of these, at the recipient's option (LICENSE.md).
                    listOf(
                        "MIT" to "https://opensource.org/license/mit",
                        "Apache-2.0" to "https://www.apache.org/licenses/LICENSE-2.0",
                        "BSD-3-Clause" to "https://opensource.org/license/bsd-3-clause",
                        "GPL-2.0-only" to "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html",
                        "GPL-3.0-only" to "https://www.gnu.org/licenses/gpl-3.0.html",
                    ).forEach { (id, link) -> license { this.name.set(id); this.url.set(link) } }
                }
                developers { developer { id.set("joelparkerhenderson"); name.set("Joel Parker Henderson") } }
                scm {
                    url.set("https://github.com/LilyDesignSystem/lily-design-system")
                    connection.set("scm:git:https://github.com/LilyDesignSystem/lily-design-system.git")
                    developerConnection.set("scm:git:ssh://git@github.com/LilyDesignSystem/lily-design-system.git")
                }
            }
        }
    }

    extensions.configure<SigningExtension> {
        val key = providers.environmentVariable("SIGNING_KEY").orNull
        isRequired = false
        if (key != null) {
            useInMemoryPgpKeys(key, providers.environmentVariable("SIGNING_PASSWORD").orNull)
            sign(extensions.getByType<PublishingExtension>().publications)
        }
    }
}
