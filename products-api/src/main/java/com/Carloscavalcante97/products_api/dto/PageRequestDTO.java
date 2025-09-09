package com.Carloscavalcante97.products_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "PageRequestDTO", description = "Pagination parameters")
public record PageRequestDTO(
        @Schema(example = "0") int page,
        @Schema(example = "10") int size
) {}
