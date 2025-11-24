package com.fungiflow.fungiflow.Event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class StockLevelEvent extends ApplicationEvent {
    private final Long productId;
    private final int currentQuantity;
    private final int thresholdLevel;

    public StockLevelEvent(Object source, Long productId, int currentQuantity, int thresholdLevel) {
        super(source);
        this.productId = productId;
        this.currentQuantity = currentQuantity;
        this.thresholdLevel = thresholdLevel;
    }
} 