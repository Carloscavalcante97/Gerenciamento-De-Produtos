package com.Carloscavalcante97.products_api.service;

import com.Carloscavalcante97.products_api.domain.Product;
import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductResponseDTO;
import com.Carloscavalcante97.products_api.dto.ProductUpdateRequestDTO;
import com.Carloscavalcante97.products_api.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.util.Optional;
import java.util.UUID;

@Service
@Validated
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<ProductResponseDTO> listProducts(Pageable pageable, String search) {
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search, pageable)
                    .map(ProductResponseDTO::from);
        }
        return productRepository.findAll(pageable).map(ProductResponseDTO::from);
    }

    public Optional<ProductResponseDTO> getProductById(UUID id) {
        return productRepository.findById(id).map(ProductResponseDTO::from);
    }

    public ProductResponseDTO createProduct(@Valid ProductRequestDTO request) {
        Product saved = productRepository.save(request.toEntity());
        return ProductResponseDTO.from(saved);
    }

    public Optional<ProductResponseDTO> updateProduct(UUID id, ProductUpdateRequestDTO request) {
        return productRepository.findById(id)
                .map(existing -> {
                    request.applyTo(existing);
                    Product saved = productRepository.save(existing);
                    return ProductResponseDTO.from(saved);
                });
    }

    public boolean deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }
}
