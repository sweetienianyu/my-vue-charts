import {
    defineComponent,
    unref,
    shallowRef,
    toRefs,
    watch,
    computed,
    inject,
    onMounted,
    onUnmounted,
    h,
    nextTick,
    watchEffect,
    getCurrentInstance,
} from 'vue'

import { init as initChart } from "echarts/core";
// import {
//     usePublicAPI,
//     useAutoresize,
//     autoresizeProps,
//     useLoading,
//     loadingProps
//   } from "./composables";

// import { omitOn } from "./utils";
// import "./style.css";

const TAG_NAME = "my-vue-echarts";
export const THEME_KEY = "ecTheme";

export const INIT_OPTIONS_KEY = "ecInitOptions";
export const UPDATE_OPTIONS_KEY = "ecUpdateOptions";
// export { LOADING_OPTIONS_KEY } from "./composables";

export default defineComponent({
    name: 'echarts',
    props: {
        option: {
            type: Object
        },
        theme: {
            type: [Object, String]
        },
        initOptions: {
            type: Object
        },
        updateOptions: {
            type: Object
        },
        group: {
            type: String
        },
        manualUpdate: {
            type: Boolean
        },
        // ...autoresizeProps,
        // ...loadingProps
    },
    inheritAttrs: false,
    setup(props, { attrs }) {
        const root = shallowRef()
        const chart = shallowRef()
        const manualOption = shallowRef()
        const defaultTheme = inject(THEME_KEY, null);
        const defaultInitOptions = inject(INIT_OPTIONS_KEY, null);
        const defaultUpdateOptions = inject(UPDATE_OPTIONS_KEY, null);

        const { autoresize, manualUpdate, loading, loadingOptions } = toRefs(props);
        const realOption = computed(
            () => manualOption.value || props.option || null
        );
        const realTheme = computed(() => props.theme || unref(defaultTheme) || {});
        const realInitOptions = computed(
            () => props.initOptions || unref(defaultInitOptions) || {}
        );
        const realUpdateOptions = computed(
            () => props.updateOptions || unref(defaultUpdateOptions) || {}
        );
        // const nonEventAttrs = computed(() => omitOn(attrs));
        const listeners = getCurrentInstance().proxy.$listeners;

        function init(option) {
            if (!root.value) {
                return;
            }
            const instance = (chart.value = initChart(
                root.value,
                realTheme.value,
                realInitOptions.value
            ))

            if (props.group) {
                instance.group = props.group
            }

            let realListeners = listeners
            if (!realListeners) {
                realListeners = {}
            }

            function resize() {
                if (instance && !instance.isDisposed()) {
                    instance.resize()
                }
            }

            function commit() {
                const opt = option || realOption.value;
                if (opt) {
                    instance.setOption(opt, realUpdateOptions.value)
                }
            }

            if (autoresize.value) {
                nextTick(() => {
                    resize()
                    commit()
                })
            } else {
                commit()
            }
        }

        function setOption(option, updateOptions) {
            if (props.manualUpdate) {
                manualOption.value = option
            }
            if (!chart.value) {
                init(option)
            } else {
                chart.value.setOption(option, updateOptions || {})
            }
        }

        function cleanup() {
            if (chart.value) {
                chart.value.dispose()
                chart.value = undefined
            }
        }
        // let unwatchOption: () => null;
        watch(
            [realTheme, realInitOptions],
            () => {
                cleanup();
                init();
            },
            {
                deep: true
            }
        );
        watchEffect(() => {
            if (props.group && chart.value) {
                chart.value.group = props.group;
            }
        });
        // const publicApi = usePublicAPI(chart);

        // useLoading(chart, loading, loadingOptions);

        // useAutoresize(chart, autoresize, root);
        onMounted(() => {
            init();
        })
        onUnmounted(cleanup);

        return {
            chart,
            root,
            setOption,
        }
    },
    render() {
        attrs.ref = "root"
        attrs.class = attrs.class ? ["echarts"].concat(attrs.class) : "echarts";
        return h(TAG_NAME, attrs)
    }
})