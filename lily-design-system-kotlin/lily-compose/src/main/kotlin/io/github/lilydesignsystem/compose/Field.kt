// Field (components/field): a label, a description, the app's control and an error. On the web the label is linked with
// `for`/`id`; there are no ids here, so Field hands the control a Modifier carrying the field's spoken name and error, and
// hides the visible copies so TalkBack stops once, on the control. TalkBack speaks the error with its own word for "error".
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * @param label the visible label, in the app's language; also the control's spoken name.
 * @param description help text, spoken after the label.
 * @param error the error; set as the control's error semantics, which TalkBack reads and Android announces.
 * @param required shows the required mark (hidden from TalkBack).
 * @param requiredLabel the word spoken for a required field ("required"); without it TalkBack does not say it is required.
 * @param control the app's control; apply the given Modifier to it (`BasicTextField(…, modifier = it)`).
 */
@Composable
public fun Field(
    label: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    error: String? = null,
    required: Boolean = false,
    requiredLabel: String? = null,
    control: @Composable (Modifier) -> Unit,
) {
    val styles = LocalLilyTextStyles.current
    val errorText = error
    val controlSemantics = Modifier.semantics {
        contentDescription = LilySemantics.fieldDescription(label, description, required, requiredLabel)
        if (!errorText.isNullOrEmpty()) error(errorText)
    }
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Row(modifier = Modifier.clearAndSetSemantics {}, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
            BasicText(label, style = styles.body)
            if (required) BasicText("*", style = styles.body)
        }
        description?.let { BasicText(it, style = styles.small, modifier = Modifier.clearAndSetSemantics {}) }
        if (!error.isNullOrEmpty()) BasicText(error, style = styles.strong, modifier = Modifier.clearAndSetSemantics {})
        control(controlSemantics)
    }
}
