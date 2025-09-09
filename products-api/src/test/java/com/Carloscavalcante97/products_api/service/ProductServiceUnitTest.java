package com.Carloscavalcante97.products_api.service;

import com.Carloscavalcante97.products_api.domain.Product;
import com.Carloscavalcante97.products_api.dto.PageRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductResponseDTO;
import com.Carloscavalcante97.products_api.dto.ProductUpdateRequestDTO;
import com.Carloscavalcante97.products_api.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceUnitTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product existingProduct;

    @BeforeEach
    void setup() {
        existingProduct = new Product();
        existingProduct.setName("Old Product");
        existingProduct.setDescription("desc");
        existingProduct.setPrice(BigDecimal.valueOf(10));
        existingProduct.setQuantity(5);
        ReflectionTestUtils.setField(existingProduct, "id", UUID.randomUUID());
    }

    @Test
    void shouldCreatePageRequestDTO() {
        PageRequestDTO dto = new PageRequestDTO(1, 20);

        assertThat(dto.page()).isEqualTo(1);
        assertThat(dto.size()).isEqualTo(20);
    }


    @Test
    void shouldListProducts() {
        when(productRepository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(existingProduct)));

        var result = productService.listProducts(PageRequest.of(0, 5), null);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Old Product");
    }

    @Test
    void shouldListProductsWhenSearchIsEmpty() {
        when(productRepository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(existingProduct)));

        Page<ProductResponseDTO> result = productService.listProducts(PageRequest.of(0, 5), "");

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Old Product");
    }

    @Test
    void shouldListProductsBySearch() {
        Product product = new Product();
        product.setName("Laptop Gamer");
        product.setDescription("desc");
        product.setPrice(BigDecimal.valueOf(2000));
        product.setQuantity(10);
        ReflectionTestUtils.setField(product, "id", UUID.randomUUID());

        when(productRepository.findByNameContainingIgnoreCase(eq("Laptop"), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(product)));

        Page<ProductResponseDTO> result = productService.listProducts(PageRequest.of(0, 5), "Laptop");

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Laptop Gamer");
    }

    @Test
    void shouldGetProductById() {
        when(productRepository.findById(existingProduct.getId())).thenReturn(Optional.of(existingProduct));

        var result = productService.getProductById(existingProduct.getId());

        assertThat(result).isPresent();
        assertThat(result.get().name()).isEqualTo("Old Product");
    }

    @Test
    void shouldCreateProduct() {
        ProductRequestDTO dto = new ProductRequestDTO("New Product", "desc", BigDecimal.valueOf(20), 5);

        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product saved = inv.getArgument(0);
            ReflectionTestUtils.setField(saved, "id", UUID.randomUUID());
            return saved;
        });

        ProductResponseDTO result = productService.createProduct(dto);

        assertThat(result.id()).isNotNull();
        assertThat(result.name()).isEqualTo("New Product");
    }

    @Test
    void shouldUpdateProduct() {
        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO("Updated", "new desc", BigDecimal.valueOf(50), 15);

        when(productRepository.findById(existingProduct.getId())).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = productService.updateProduct(existingProduct.getId(), dto);

        assertThat(result).isPresent();
        assertThat(result.get().name()).isEqualTo("Updated");
    }
    @Test
    void shouldUpdateNameWhenNotNull() {
        Product product = new Product();
        product.setName("Old Name");

        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO("New Name", null, null, null);
        dto.applyTo(product);

        assertThat(product.getName()).isEqualTo("New Name");
    }

    @Test
    void shouldUpdateDescriptionWhenNotNull() {
        Product product = new Product();
        product.setDescription("Old Desc");

        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO(null, "New Desc", null, null);
        dto.applyTo(product);

        assertThat(product.getDescription()).isEqualTo("New Desc");
    }

    @Test
    void shouldUpdatePriceWhenNotNull() {
        Product product = new Product();
        product.setPrice(BigDecimal.valueOf(50));

        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO(null, null, BigDecimal.valueOf(99.99), null);
        dto.applyTo(product);

        assertThat(product.getPrice()).isEqualByComparingTo("99.99");
    }

    @Test
    void shouldUpdateQuantityWhenNotNull() {
        Product product = new Product();
        product.setQuantity(10);

        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO(null, null, null, 20);
        dto.applyTo(product);

        assertThat(product.getQuantity()).isEqualTo(20);
    }

    @Test
    void shouldNotUpdateAnythingWhenAllFieldsNull() {
        Product product = new Product();
        product.setName("Original Name");
        product.setDescription("Original Desc");
        product.setPrice(BigDecimal.valueOf(10));
        product.setQuantity(5);

        ProductUpdateRequestDTO dto = new ProductUpdateRequestDTO(null, null, null, null);
        dto.applyTo(product);

        assertThat(product.getName()).isEqualTo("Original Name");
        assertThat(product.getDescription()).isEqualTo("Original Desc");
        assertThat(product.getPrice()).isEqualByComparingTo("10");
        assertThat(product.getQuantity()).isEqualTo(5);
    }

    @Test
    void shouldReturnEmptyWhenUpdatingNonexistentProduct() {
        UUID id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(Optional.empty());

        var result = productService.updateProduct(id, new ProductUpdateRequestDTO("Ghost", "desc", BigDecimal.TEN, 1));

        assertThat(result).isEmpty();
    }

    @Test
    void shouldDeleteProduct() {
        when(productRepository.existsById(existingProduct.getId())).thenReturn(true);

        boolean deleted = productService.deleteProduct(existingProduct.getId());

        assertThat(deleted).isTrue();
        verify(productRepository).deleteById(existingProduct.getId());
    }

    @Test
    void shouldNotDeleteNonexistentProduct() {
        UUID fakeId = UUID.randomUUID();
        when(productRepository.existsById(fakeId)).thenReturn(false);

        boolean deleted = productService.deleteProduct(fakeId);

        assertThat(deleted).isFalse();
        verify(productRepository, never()).deleteById(fakeId);
    }


}
