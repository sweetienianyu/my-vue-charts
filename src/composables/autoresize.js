import { watch } from "vue"


export function useAutoresize(chart, autoresize, root) {
    let resizeListener = null
    watch([root, chart, autoresize], ([root, chart]))
}