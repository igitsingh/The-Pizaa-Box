package in.thepizzabox.mobile.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import in.thepizzabox.mobile.viewmodel.CartViewModel

@Composable
fun CartScreen(viewModel: CartViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Your Cart", style = MaterialTheme.typography.headlineMedium)
            
            // Cart Items List...
            
            Spacer(modifier = Modifier.weight(1f))
            
            if (uiState.isGuest && !uiState.checkoutProcessStarted) {
                GuestCheckoutPrompt(
                    onLogin = { viewModel.login() },
                    onContinueAsGuest = { viewModel.continueAsGuest() }
                )
            } else {
                Button(
                    onClick = { viewModel.onCheckoutClicked() },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Proceed to Checkout")
                }
            }
        }
    }
}

@Composable
fun GuestCheckoutPrompt(
    onLogin: () -> Unit,
    onContinueAsGuest: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Continue Your Order", style = MaterialTheme.typography.titleLarge)
            Text("Login to earn reward points or checkout as a guest.", modifier = Modifier.padding(vertical = 8.dp))
            
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = onLogin,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Login")
                }
                Button(
                    onClick = onContinueAsGuest,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Guest Checkout")
                }
            }
        }
    }
}
