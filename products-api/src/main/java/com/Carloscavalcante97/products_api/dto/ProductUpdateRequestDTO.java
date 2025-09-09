package com.Carloscavalcante97.products_api.dto;

import com.Carloscavalcante97.products_api.domain.Product;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public record ProductUpdateRequestDTO(
        @Schema(example = "Notebook Gamer") String name,
        @Schema(example = "16GB RAM, RTX 3050") String description,
        @Schema(example = "4500.00") BigDecimal price,
        @Schema(example = "10") Integer quantity
) {
    public void applyTo(Product product){
        if (name != null) product.setName(name);
        if (description != null) product.setDescription(description);
        if (price != null) product.setPrice(price);
        if (quantity != null) product.setQuantity(quantity);
    }
}
