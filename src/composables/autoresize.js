import { watch } from "vue"
import { throttle } from "echarts/core";
import { addListener, removeListener } from "resize-detector";


export function useAutoresize(chart, autoresize, root, [root, chart, autoresize]) {
    let resizeListener = null
    watch([root, chart, autoresize], ([root, chart, autoresize], _, cleanup) => {
        if (root && chart && autoresize) {
            resizeListener = throttle(() => {
                chart.resize();
            }, 100);

            addListener(root, resizeListener);
        }

        cleanup(() => {
            if (resizeListener && root) {
                removeListener(root, resizeListener);
            }
        });
    });
}