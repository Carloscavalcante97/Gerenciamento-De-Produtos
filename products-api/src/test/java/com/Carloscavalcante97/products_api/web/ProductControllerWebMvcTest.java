package com.Carloscavalcante97.products_api.web;

import com.Carloscavalcante97.products_api.dto.ProductRequestDTO;
import com.Carloscavalcante97.products_api.dto.ProductResponseDTO;
import com.Carloscavalcante97.products_api.dto.ProductUpdateRequestDTO;
import com.Carloscavalcante97.products_api.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerWebMvcTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldCreateProduct() throws Exception {
        ProductRequestDTO request = new ProductRequestDTO("New Product", "Desc", BigDecimal.valueOf(99.99), 10);
        ProductResponseDTO response = new ProductResponseDTO(UUID.randomUUID(), "New Product", "Desc", BigDecimal.valueOf(99.99), 10, null);

        Mockito.when(productService.createProduct(any(ProductRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("New Product")))
                .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    void shouldReturnProductById() throws Exception {
        UUID id = UUID.randomUUID();
        ProductResponseDTO response = new ProductResponseDTO(id, "Test Product", "Desc", BigDecimal.valueOf(50), 5, null);

        Mockito.when(productService.getProductById(eq(id))).thenReturn(Optional.of(response));

        mockMvc.perform(get("/api/products/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.toString())))
                .andExpect(jsonPath("$.name", is("Test Product")));
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.when(productService.getProductById(eq(id))).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateProduct() throws Exception {
        UUID id = UUID.randomUUID();
        ProductUpdateRequestDTO request = new ProductUpdateRequestDTO("Updated Product", "Updated Desc", BigDecimal.valueOf(120), 7);
        ProductResponseDTO response = new ProductResponseDTO(id, "Updated Product", "Updated Desc", BigDecimal.valueOf(120), 7, null);

        Mockito.when(productService.updateProduct(eq(id), any())).thenReturn(Optional.of(response));

        mockMvc.perform(put("/api/products/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Product")))
                .andExpect(jsonPath("$.price").value(120));
    }

    @Test
    void shouldReturn404WhenUpdatingNonexistentProduct() throws Exception {
        UUID id = UUID.randomUUID();
        ProductUpdateRequestDTO request = new ProductUpdateRequestDTO("Ghost Product", "Does not exist", BigDecimal.valueOf(10), 1);

        Mockito.when(productService.updateProduct(eq(id), any())).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/products/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteProduct() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.when(productService.deleteProduct(eq(id))).thenReturn(true);

        mockMvc.perform(delete("/api/products/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeletingNonexistentProduct() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.when(productService.deleteProduct(eq(id))).thenReturn(false);

        mockMvc.perform(delete("/api/products/" + id))
                .andExpect(status().isNotFound());
    }
}
