package in.thepizzabox.mobile.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "guest_cart_items")
data class GuestCartItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val menuItemId: String,
    val nameSnapshot: String,
    val priceSnapshot: Double,
    val quantity: Int,
    val selectedOptions: String, // Store as JSON string
    val lineTotal: Double
)

@Entity(tableName = "guest_address")
data class GuestAddress(
    @PrimaryKey val id: Int = 1, // Only one guest address stored locally
    val line1: String,
    val line2: String?,
    val locality: String,
    val city: String,
    val state: String,
    val pincode: String,
    val phone: String
)
