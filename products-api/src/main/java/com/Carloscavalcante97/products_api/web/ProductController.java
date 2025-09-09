package com.Carloscavalcante97.products_api.web;

import java.net.URI;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Carloscavalcante97.products_api.dto.PageRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductResponseDTO;
import com.Carloscavalcante97.products_api.dto.ProductUpdateRequestDTO;
import com.Carloscavalcante97.products_api.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "List products paginated")
    public Page<ProductResponseDTO> getAllProducts(
            @Parameter(schema = @Schema(implementation = PageRequestDTO.class)) Pageable pageable,
            @RequestParam(required = false) String search
    ) {
        return productService.listProducts(pageable, search);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Product by id")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable UUID id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a product")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestBody ProductRequestDTO request) {
        ProductResponseDTO dto = productService.createProduct(request);
        return ResponseEntity
                .created(URI.create("/products/" + dto.id()))
                .body(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateRequestDTO request) {
        return productService.updateProduct(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        boolean deleted = productService.deleteProduct(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
