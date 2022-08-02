const METHOD_NAMES = [
    "getWidth",
    "getHeight",
    "getDom",
    "getOption",
    "resize",
    "dispatchAction",
    "convertToPixel",
    "convertFromPixel",
    "containPixel",
    "getDataURL",
    "getConnectedDataURL",
    "appendData",
    "clear",
    "isDisposed",
    "dispose"
]

export function usePublicAPI(chart) {
    function makePublicMethod(name) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!chart.value) {
                throw new Error("ECharts is not initialized yet.");
            }
            return chart.value[name].apply(chart.value, args);
        };
    }
    function makePublicMethods() {
        var methods = Object.create(null);
        METHOD_NAMES.forEach(function (name) {
            methods[name] = makePublicMethod(name);
        });
        return methods;
    }
    return makePublicMethods();
}
