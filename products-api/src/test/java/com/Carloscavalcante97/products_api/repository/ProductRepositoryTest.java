package com.Carloscavalcante97.products_api.repository;

import com.Carloscavalcante97.products_api.domain.Product;
import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@DataJpaTest
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        ProductRequestDTO p1 = new ProductRequestDTO("iPhone", "Apple smartphone",
                BigDecimal.valueOf(999.99), 10);

        ProductRequestDTO p2 = new ProductRequestDTO("Samsung Galaxy", "Android smartphone",
                BigDecimal.valueOf(899.99), 8);

        productRepository.save(p1.toEntity());
        productRepository.save(p2.toEntity());
    }

    @Test
    void shouldFindByNameContainingIgnoreCase() {
        Page<Product> page = productRepository.findByNameContainingIgnoreCase("iphone", PageRequest.of(0, 5));
        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).getName()).isEqualTo("iPhone");
    }

    @Test
    void shouldNotFindAnyProduct() {
        Page<Product> page = productRepository.findByNameContainingIgnoreCase("não existe", PageRequest.of(0, 5));
        assertThat(page.getContent()).isEmpty();
    }

}
