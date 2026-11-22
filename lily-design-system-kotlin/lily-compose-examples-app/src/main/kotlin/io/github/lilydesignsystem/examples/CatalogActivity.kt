// The example app's one screen: the searchable catalog, a detail view per component, system back to return. Edge to edge,
// light or dark with the system, every word from strings.xml.
package io.github.lilydesignsystem.examples

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import io.github.lilydesignsystem.compose.examples.ExampleCatalog
import io.github.lilydesignsystem.compose.themes.LilyTheme
import io.github.lilydesignsystem.compose.themes.LilyTokens

class CatalogActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val tokens = if (isSystemInDarkTheme()) LilyTokens.dark else LilyTokens.light
            var selected by rememberSaveable { mutableStateOf<String?>(null) }
            BackHandler(enabled = selected != null) { selected = null }
            LilyTheme(tokens) {
                ExampleCatalog(
                    title = stringResource(R.string.catalog_title),
                    searchLabel = stringResource(R.string.catalog_search),
                    selected = selected,
                    onSelect = { selected = it },
                    modifier = Modifier.fillMaxSize().background(tokens.base100).safeDrawingPadding(),
                )
            }
        }
    }
}
