package com.Carloscavalcante97.products_api.service;

import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.math.BigDecimal;
import java.util.Set;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ProductServiceIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private Validator validator;

    @Test
    void shouldThrowWhenCreatingWithNegativePrice() {
        ProductRequestDTO dto = new ProductRequestDTO(
                "Invalid", "desc", BigDecimal.valueOf(-10), 5);

        Set<ConstraintViolation<ProductRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .anyMatch(v -> v.getMessage().equals("Product price must be greater than zero"));
    }

    @Test
    void shouldThrowWhenCreatingWithNegativeQuantity() {
        ProductRequestDTO dto = new ProductRequestDTO(
                "Invalid", "desc", BigDecimal.valueOf(100), -5);

        Set<ConstraintViolation<ProductRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .anyMatch(v -> v.getMessage().equals("Product quantity cannot be negative"));
    }
    @Test
    void shouldThrowWhenCreatingWithNegativeQuantityAndZeroPrice() {
        ProductRequestDTO dto = new ProductRequestDTO(
                "Invalid", "desc", BigDecimal.valueOf(0), -5
        );
        Set<ConstraintViolation<ProductRequestDTO>> violations = validator.validate(dto);
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .contains(
                        "Product price must be greater than zero",
                        "Product quantity cannot be negative"
                );

    }

    @Test
    void shouldPersistValidProduct() {
        ProductRequestDTO dto = new ProductRequestDTO(
                "Valid Product", "desc", BigDecimal.valueOf(50), 0);

        var result = productService.createProduct(dto);

        assertThat(result.id()).isNotNull();
        assertThat(result.name()).isEqualTo("Valid Product");
    }



}
