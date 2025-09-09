package com.Carloscavalcante97.products_api.web;

import com.Carloscavalcante97.products_api.domain.Product;
import com.Carloscavalcante97.products_api.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.math.BigDecimal;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product existingProduct;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        existingProduct = new Product();
        existingProduct.setName("Integration Product");
        existingProduct.setDescription("Test Desc");
        existingProduct.setPrice(BigDecimal.valueOf(20.0));
        existingProduct.setQuantity(5);
        productRepository.save(existingProduct);
    }

    @Test
    void shouldListProducts() throws Exception {
        mockMvc.perform(get("/api/products?page=0&size=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name", is("Integration Product")));
    }

    @Test
    void shouldGetProductById() throws Exception {
        mockMvc.perform(get("/api/products/" + existingProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(existingProduct.getId().toString())))
                .andExpect(jsonPath("$.name", is("Integration Product")));
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        mockMvc.perform(get("/api/products/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateProduct() throws Exception {
        String payload = """
            {
              "name": "New Product",
              "description": "New Desc",
              "price": 99.99,
              "quantity": 10
            }
            """;

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("New Product")));
    }

    @Test
    void shouldUpdateProduct() throws Exception {
        String payload = """
            {
              "name": "Updated Product",
              "description": "Updated Desc",
              "price": 50.0,
              "quantity": 15
            }
            """;

        mockMvc.perform(put("/api/products/" + existingProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Product")))
                .andExpect(jsonPath("$.price", is(50.0)));
    }

    @Test
    void shouldDeleteProduct() throws Exception {
        mockMvc.perform(delete("/api/products/" + existingProduct.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeletingNonexistentProduct() throws Exception {
        mockMvc.perform(delete("/api/products/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound());
    }
}
