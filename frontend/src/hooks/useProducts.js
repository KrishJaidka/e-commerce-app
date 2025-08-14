import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialParams = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState(initialParams);

    const fetchProducts = useCallback(async (params = {}, isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            // Don't clear products immediately to prevent flickering
        }
        setError(null);

        try {
            const response = await productService.getProducts(params);

            if (response.success) {
                if (isLoadMore) {
                    setProducts(prev => [...prev, ...response.data.products]);
                } else {
                    setProducts(response.data.products);
                }
                setPagination(response.data.pagination);
                setFilters(response.data.filters);
            } else {
                setError(response.message || 'Failed to fetch products');
                if (!isLoadMore) {
                    setProducts([]);
                }
            }
        } catch (err) {
            setError(err.message);
            if (!isLoadMore) {
                setProducts([]);
            }
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    }, []);

    const searchProducts = useCallback(async (searchTerm, additionalFilters = {}) => {
        const searchParams = {
            search: searchTerm,
            page: 1, // Reset to page 1 for new search
            ...additionalFilters
        };
        await fetchProducts(searchParams, false);
    }, [fetchProducts]);

    const filterProducts = useCallback(async (newFilters) => {
        const filterParams = {
            ...newFilters,
            page: 1 // Reset to page 1 for new filter
        };
        await fetchProducts(filterParams, false);
    }, [fetchProducts]);

    const loadMore = useCallback(async () => {
        if (pagination && pagination.hasNext && !loadingMore) {
            const nextPageParams = {
                ...filters,
                page: pagination.currentPage + 1
            };

            await fetchProducts(nextPageParams, true);
        }
    }, [pagination, filters, loadingMore, fetchProducts]);

    const refreshProducts = useCallback(() => {
        fetchProducts(filters, false);
    }, [filters, fetchProducts]);

    useEffect(() => {
        fetchProducts(initialParams, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        products,
        loading,
        loadingMore,
        error,
        pagination,
        filters,
        fetchProducts: (params) => fetchProducts(params, false),
        searchProducts,
        filterProducts,
        loadMore,
        refreshProducts
    };
};

export default useProducts;
