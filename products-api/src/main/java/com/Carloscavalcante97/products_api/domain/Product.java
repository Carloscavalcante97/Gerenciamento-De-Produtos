package com.Carloscavalcante97.products_api.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Column(nullable = false)

    @Schema(example = "Notebook")
    private String name;

    @Schema(example = "14-inch")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    @Schema(example = "3500.00", description = "Numeric price for calculations")
    private BigDecimal price;

    @Schema(example = "5")
    private Integer quantity;

    @Column(nullable = false, updatable = false)
    @Schema(example = "2025-09-08T14:30:00Z", description = "Creation timestamp (ISO-8601)")
    private LocalDateTime createdAt;



    public UUID getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().minusHours(3);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
