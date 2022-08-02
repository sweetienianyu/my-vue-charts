import {
    inject,
    unref,
    computed,
    watchEffect,
} from 'vue'

export const LOADING_OPTIONS_KEY = "ecLoadingOptions"

export function useLoading(chart, loading, loadingOptions) {
    const defaultLoadingOptions = inject(LOADING_OPTIONS_KEY, {})
    const realLoadingOptions = computed(() => ({
        ...unref(defaultLoadingOptions),
        ...loadingOptions?.value
    }));
    watchEffect(() => {
        const instance = chart.value
        if (!instance) {
            return
        }
        if (loading.value) {
            instance.showLoading(realLoadingOptions.value)
        } else {
            instance.hideLoading()
        }
    })
}

