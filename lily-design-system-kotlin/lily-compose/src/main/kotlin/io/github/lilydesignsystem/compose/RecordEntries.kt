// A record list reads its entries before it says what its status is (HC-C17): each Lily item tells its list whether it counts. An
// item that is refuted or entered in error does not. Another composable in the list is not an item, and is not counted.
package io.github.lilydesignsystem.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.setValue

internal class RecordEntries {
    private var count by mutableIntStateOf(0)
    val any: Boolean get() = count > 0

    fun add() {
        count += 1
    }

    fun remove() {
        count -= 1
    }
}

internal val LocalRecordEntries = compositionLocalOf<RecordEntries?> { null }

@Composable
internal fun RecordEntry(counts: Boolean) {
    val entries = LocalRecordEntries.current
    DisposableEffect(entries, counts) {
        if (counts) entries?.add()
        onDispose { if (counts) entries?.remove() }
    }
}
