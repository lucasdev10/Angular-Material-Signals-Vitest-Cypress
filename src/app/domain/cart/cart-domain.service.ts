import { Injectable } from '@angular/core';
import { ICartItem } from '@app/features/cart/models/cart.model';
import { APP_CONFIG } from '@app/shared/config/app.config';

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Cálculos do carrinho
 */
export interface CartCalculations {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

/**
 * Serviço de domínio para regras de negócio do carrinho
 * Centraliza toda a lógica de negócio relacionada ao carrinho
 */
@Injectable({
  providedIn: 'root',
})
export class CartDomainService {
  /**
   * Calcula o imposto baseado no subtotal
   */
  calculateTax(subtotal: number): number {
    if (subtotal < 0) {
      throw new Error('Subtotal cannot be negative');
    }
    return Math.round(subtotal * APP_CONFIG.cart.TAX_RATE * 100) / 100;
  }

  /**
   * Calcula o frete baseado no subtotal
   */
  calculateShipping(subtotal: number): number {
    if (subtotal < 0) {
      throw new Error('Subtotal cannot be negative');
    }

    return subtotal >= APP_CONFIG.cart.SHIPPING_THRESHOLD ? 0 : APP_CONFIG.cart.SHIPPING_COST;
  }

  /**
   * Calcula o subtotal dos itens
   */
  calculateSubtotal(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /**
   * Calcula a contagem total de itens
   */
  calculateItemCount(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Calcula todos os valores do carrinho
   */
  calculateCartTotals(items: ICartItem[]): CartCalculations {
    const subtotal = this.calculateSubtotal(items);
    const tax = this.calculateTax(subtotal);
    const shipping = this.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;
    const itemCount = this.calculateItemCount(items);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount,
    };
  }

  /**
   * Valida um item do carrinho
   */
  validateCartItem(item: ICartItem): ValidationResult {
    const errors: string[] = [];

    // Validar produto
    if (!item.product) {
      errors.push('Product is required');
    } else {
      if (!item.product.id) {
        errors.push('Product must have an ID');
      }
      if (!item.product.name?.trim()) {
        errors.push('Product must have a name');
      }
      if (typeof item.product.price !== 'number' || item.product.price < 0) {
        errors.push('Product must have a valid price');
      }
      if (typeof item.product.stock !== 'number' || item.product.stock < 0) {
        errors.push('Product must have valid stock information');
      }
    }

    // Validar quantidade
    if (!Number.isInteger(item.quantity) || item.quantity < APP_CONFIG.cart.MIN_QUANTITY_PER_ITEM) {
      errors.push(`Quantity must be at least ${APP_CONFIG.cart.MIN_QUANTITY_PER_ITEM}`);
    }
    if (item.quantity > APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM) {
      errors.push(`Quantity cannot exceed ${APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM}`);
    }

    // Validar estoque
    if (item.product && item.quantity > item.product.stock) {
      errors.push(`Quantity (${item.quantity}) exceeds available stock (${item.product.stock})`);
    }

    // Validar subtotal
    const expectedSubtotal = item.product ? item.product.price * item.quantity : 0;
    if (Math.abs(item.subtotal - expectedSubtotal) > 0.01) {
      errors.push('Subtotal calculation is incorrect');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida todos os itens do carrinho
   */
  validateCart(items: ICartItem[]): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(items)) {
      errors.push('Cart items must be an array');
      return { isValid: false, errors };
    }

    // Validar cada item
    items.forEach((item, index) => {
      const itemValidation = this.validateCartItem(item);
      if (!itemValidation.isValid) {
        errors.push(`Item ${index + 1}: ${itemValidation.errors.join(', ')}`);
      }
    });

    // Validar duplicatas
    const productIds = items.map((item) => item.product?.id).filter(Boolean);
    const uniqueProductIds = new Set(productIds);
    if (productIds.length !== uniqueProductIds.size) {
      errors.push('Cart contains duplicate products');
    }

    // Validar limites do carrinho
    const totalItems = this.calculateItemCount(items);
    if (totalItems > 100) {
      // Limite arbitrário para exemplo
      errors.push('Cart cannot contain more than 100 items');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Verifica se o carrinho qualifica para frete grátis
   */
  qualifiesForFreeShipping(subtotal: number): boolean {
    return subtotal >= APP_CONFIG.cart.SHIPPING_THRESHOLD;
  }

  /**
   * Calcula quanto falta para frete grátis
   */
  amountNeededForFreeShipping(subtotal: number): number {
    if (this.qualifiesForFreeShipping(subtotal)) {
      return 0;
    }
    return APP_CONFIG.cart.SHIPPING_THRESHOLD - subtotal;
  }

  /**
   * Formata valor monetário
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Verifica se um produto pode ser adicionado ao carrinho
   */
  canAddProductToCart(
    productId: string,
    requestedQuantity: number,
    currentItems: ICartItem[],
    productStock: number,
  ): ValidationResult {
    const errors: string[] = [];

    // Validar entrada
    if (!productId?.trim()) {
      errors.push('Product ID is required');
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      errors.push('Quantity must be a positive integer');
    }

    if (requestedQuantity > APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM) {
      errors.push(`Quantity cannot exceed ${APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM}`);
    }

    // Verificar estoque
    const existingItem = currentItems.find((item) => item.product.id === productId);
    const currentQuantity = existingItem?.quantity || 0;
    const totalQuantity = currentQuantity + requestedQuantity;

    if (totalQuantity > productStock) {
      errors.push(`Only ${productStock - currentQuantity} more items can be added`);
    }

    if (totalQuantity > APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM) {
      errors.push(
        `Total quantity would exceed maximum of ${APP_CONFIG.cart.MAX_QUANTITY_PER_ITEM}`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
