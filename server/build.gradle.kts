import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.gradle.api.internal.initialization.ClassLoaderIds.buildScript
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

buildscript {
    dependencies {
        classpath("de.sebastianboegl.gradle.plugins:shadow-log4j-transformer:2.2.0")
    }
}

plugins {
    java
    application
    kotlin("jvm") version "1.3.10"
    id("com.github.johnrengelman.shadow") version "4.0.3"
}

repositories {
    jcenter()
}

val javaVersion: JavaVersion by extra { JavaVersion.VERSION_1_8 }
group = "ballad"
version = "0.1"
description = "Ballad game server"

java {
    sourceCompatibility = javaVersion
    targetCompatibility = javaVersion
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

application {
    applicationName = rootProject.name
    mainClassName = "ballad.server.api.App"
}

dependencies {
    compile("org.jetbrains:annotations:15.0")
    compile("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    compile("io.vertx:vertx-core:3.5.4")
    compile("org.apache.logging.log4j:log4j-api:2.10.0")
    compile("org.apache.logging.log4j:log4j-core:2.10.0")
    compile("org.apache.logging.log4j:log4j-slf4j-impl:2.10.0")
}

tasks.withType<ShadowJar> {
    archiveName = "server.jar"
    transform(de.sebastianboegl.gradle.plugins.shadow.transformers.Log4j2PluginsFileTransformer::class.java)
    manifest {
        attributes(mapOf("Main-Class" to "ballad.server.api.App"))

    }
    mergeServiceFiles {
        include("META-INF/services/io.vertx.core.spi.VerticleFactory")
    }
}