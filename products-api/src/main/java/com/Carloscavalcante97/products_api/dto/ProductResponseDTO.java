package com.Carloscavalcante97.products_api.dto;

import com.Carloscavalcante97.products_api.domain.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        Integer quantity,
        LocalDateTime createdAt) {

    public static ProductResponseDTO from(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getCreatedAt()
        );
    }
}