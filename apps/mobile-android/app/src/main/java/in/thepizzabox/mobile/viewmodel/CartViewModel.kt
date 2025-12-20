package in.thepizzabox.mobile.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

data class CartUiState(
    val isGuest: Boolean = true,
    val showGuestPrompt: Boolean = false,
    val items: List<Any> = emptyList(),
    val address: Any? = null,
    val total: Double = 0.0,
    val checkoutProcessStarted: Boolean = false
)

class CartViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(CartUiState())
    val uiState: StateFlow<CartUiState> = _uiState

    init {
        checkAuthStatus()
    }

    private fun checkAuthStatus() {
        // Logic to check if JWT exists in DataStore/SharedPreferences
        val hasToken = false // Placeholder for simulation
        _uiState.value = _uiState.value.copy(isGuest = !hasToken)
    }

    fun onCheckoutClicked() {
        if (_uiState.value.isGuest) {
            _uiState.value = _uiState.value.copy(showGuestPrompt = true)
        } else {
            // Normal checkout flow for logged in users
        }
    }

    fun continueAsGuest() {
        _uiState.value = _uiState.value.copy(
            showGuestPrompt = false,
            checkoutProcessStarted = true
        )
        // Transition to local address form
    }

    fun login() {
        // Navigate to Login Screen
    }
}
