package com.Carloscavalcante97.products_api.dto;

import com.Carloscavalcante97.products_api.domain.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequestDTO(
        @NotBlank(message = "Product name is required")
        @Schema(example = "Macbook")
        String name,

        @Schema(example = "14-inch screen, 16GB RAM")
        String description,

        @NotNull(message = "Product price is required")
        @Min(value = 1, message = "Product price must be greater than zero")
        @Schema(example = "3500.00")
        BigDecimal price,

        @NotNull(message = "Product quantity is required")
        @Min(value = 0, message = "Product quantity cannot be negative")
        @Schema(example = "1", defaultValue = "0", description = "Quantity of products, must be >= 0")
        Integer quantity
) {
    public Product toEntity() {
        Product p = new Product();
        applyTo(p);
        return p;
    }
    public void applyTo(Product p) {
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setQuantity(quantity);
    }
}
